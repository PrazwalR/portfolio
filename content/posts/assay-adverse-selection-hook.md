## The problem that started it

I got a place in UHI10, Atrium Academy's Uniswap Hook Incubator, and I wanted to build something that wasn't a toy. Not a fee-splitter, not a points program. Something that took a real, expensive, unsolved problem in AMM design and made a genuine attempt at it.

The problem I picked was this: every dynamic-fee hook shipping today sets its fee from volatility. Volatility is a property of the block. It is one number, and everyone in that block pays it.

So a $50 retail swap and a $50,000 arbitrage hitting the same stale price pay the same rate. One of those is a liquidity provider's entire revenue. The other is their entire loss. Charging them identically means you systematically overcharge the flow you want and undercharge the flow that's taking your money. That gap has a name — loss-versus-rebalancing — and it's the largest structural cost of providing liquidity anywhere.

Uniswap v4 changed the one thing that makes a fix possible: a hook returns a fee per swap, not per pool. So the question became narrow and answerable. What can you measure that actually differs between two orders arriving in the same block?

That's Assay. The answer turned out to be one subtraction and a sign.

## The initial hurdle: what do you even measure?

The first design problem wasn't Solidity. It was picking a quantity.

Volatility fails because it describes the market. Order size fails because a whale rebalancing isn't toxic and a small MEV bot is. Sender address fails because it's trivially sybilled. I needed something that was a property of the order's relationship to the pool, computable on the swap path, in a few hundred gas.

What worked: the signed gap between the pool's tick and a Chainlink reference. In ticks, so it's one subtraction and no division — nothing that can revert. Then sign it by the direction the swap trades.

```solidity
int256 gap = int256(referenceTick) - int256(poolTick);
return zeroForOne ? -gap : gap;
```

Trade toward the reference and you're closing the gap — that's the arbitrage, and the value you capture is positive. Trade away from it and you capture nothing, so it's negative. Fee is the base rate plus ten percent of whatever you captured, clamped to a floor and a ceiling.

That's the whole mechanism. `Mispricing.signedTicks` is nine lines. Committing to it early — one signed scalar, everything downstream derived from it — is what made everything else possible.

Live on Base Sepolia right now, the same pool in the same block at the same drift quotes one direction 12.30 bp and the other, trading away from the gap, the 1 bp floor. A volatility-based hook cannot produce that. It has one number for both.

## First deploy, first reality check

v4 hooks live at addresses whose low bits encode their permissions, so you mine a CREATE2 salt until you find one that matches. Which means every time the source changes, the address changes, and every reference to it — scripts, tests, frontend config, docs — has to move with it.

Then a genuinely stupid one. My `.gitignore` had an unanchored `lib/` in it, meant for Foundry dependencies. It was also silently excluding `frontend/src/lib/` — twenty-two files, including the entire TypeScript port of the fee math. The repo did not build from a fresh clone and hadn't for weeks. I only caught it on an audit pass that specifically asked "does this build from scratch," which is not a question you think to ask about your own project.

Two more from the same week, both in tooling rather than code. `forge coverage` silently ignores `--no-match-path` — unlike `forge test`, which honours it — so my gas tests were running under coverage instrumentation and blowing their budgets in CI while passing locally. And a `build.env` block in `vercel.json` didn't match the current schema, so Vercel rejected the file before compiling, and every commit after it silently never deployed. The dashboard shows nothing. You just stop shipping.

## The major coding struggle: the mechanism was inverted

Here's the one that actually mattered.

I ran an audit pass over the contracts — eight parallel checklists, oracle security, AMM patterns, DoS, flash loans. It found six things. Five were ordinary. The sixth was that my hook charged the wrong swap.

The reference refreshed in `afterSwap`. So every swap was priced against whatever the previous swap had cached. Which means the arbitrageur reacting first to a real oracle move — the trade that captures the entire dislocation, the exact swap this whole project exists to charge — was quoted against the stale, pre-move reference.

Measured on a 20% oracle move: the first reactor paid 490 pips. The base fee is 500. They got a discount for capturing the whole gap. The swap arriving after them, capturing nothing because the gap was already gone, paid the 10,000-pip ceiling.

The hook was doing the precise opposite of its stated purpose, and it had passed every test I'd written, because every test moved the oracle and then swapped twice — which papers over exactly this. `test/exploit/ReferenceLag.t.sol` pins the numbers now, 490 before and 10,000 after, so it can't regress without a test catching it.

## The bug my fix created

Moving the refresh into `beforeSwap` fixed it. It also introduced a new bug, which a second audit pass caught before it shipped.

Both the TWAP sample and the oracle-refresh retry were gated on the same `lastBlock` field. If the oracle call reverted, the refresh would retry on the next swap in that block — correct — but it would also re-open the TWAP fold, letting a swap in the current block walk the anchor using a tick that same swap had just moved. The anchor is what validates the oracle. Manipulating it is how you defeat the check that exists to catch a manipulated oracle.

Fix was a separate block tracker for the sample. What convinced me it was real: I put the old, single-tracker version back, watched a same-block swap move the anchor 121× further than it should, then removed it again and watched the test go green. That's now `test_Regression_TwapDoesNotFoldSameBlockTickWhileOracleIsStuck`, which is a terrible name and exactly describes what it does.

## Defending an oracle you can't verify

A Chainlink reading can pass every check my adapter makes — fresh, positive, decimals validated, in range — and still be wrong. A compromised aggregator, a misconfiguration, on a chain the hook has no independent view of.

So a fresh reading gets checked a second time against an EWMA of the pool's own tick, sampled once per block before the current block's swaps can touch it. That's what makes it resistant to being defeated from inside the same transaction that needs the bad reading to look consistent.

The sequencer one I got wrong first. My security notes originally argued that skipping Chainlink's L2 uptime feed was safe, because a down sequencer stops the aggregator updating, so staleness fires and the pool over-charges. That's only true once the outage exceeds the staleness bound. A shorter halt — one that resolves before staleness trips — freezes the pool's tick and the feed's timestamp at the same instant. On resumption they still agree with each other while both disagree with the world, so drift reads as zero at exactly the moment it's largest.

That's under-charging, not over-charging, and I had it backwards in writing for weeks. The hook now detects it directly: wall clock and block production should advance together, and a halt is the one shape where they don't.

## The frontend lied too

I assumed the contracts were where the risk was. The interface was worse, because nothing forced its numbers to be true.

Three surfaces stated the pool's trading history by hand and had drifted apart from each other — the landing page said nine swaps, Markets said twelve, the docs said twelve. I counted the actual `SwapAssayed` events. Fourteen, ranging 1.00 to 98.10 bp. Nobody was right.

The fee derivation panel took its colour from a `Math.random()` walk left over from a pre-chain-read demo, while every number in it came from live state — so a live floor quote rendered in the colour of a capturing one, and re-tinted every 2.2 seconds while the numbers underneath sat still. The fee amount rounded to zero on every small swap, because a 1 bp charge on a 0.00189 WETH output is 0.000000189, and I'd formatted it at the token's five display decimals. And one panel told the reader two figures "come out of a `SwapAssayed` event you can read on Basescan" when both were local projections that had never touched a chain.

The one that stung most: a caption citing a test as having "measured 100 bp against 1 bp." That test asserts an inequality. Those two numbers are just the configured bounds, dressed up as a measurement. I wrote that caption myself and believed it for a month.

Then the split that only production finds. The activity feed worked locally and failed on deploy, silently, returning zero rows instead of the hook's logs. Vercel had an Alchemy key set; localhost fell back to Base's public endpoint. Alchemy's free tier caps `eth_getLogs` at a 10-block range. My chunks were 9,999. Every request rejected in prod, every request fine locally, invisible in development by construction.

## How it works now

`beforeSwap` refreshes the cached reference at most once per block, checks it against the pool's own smoothed tick, computes the signed drift, and returns a fee override. Extreme dislocations that exceed the fee ceiling take a surcharge in the swap's own token, routed to in-range liquidity via `donate()`. No owner, no withdrawal path, capped at 2% of notional. `afterSwap` records the tick. The ordinary path is about 16k gas and makes no external call at all; the reference lives in one packed storage slot, 248 of 256 bits used.

201 tests, 100% line coverage on `src/`, fuzz and invariant suites, plus a fork suite that runs real swaps against the deployed bytecode and asserts the emitted event matches a locally predicted fee. The deployed contract is byte-identical to a local build — I checked; the 341 differing bytes are all a constructor-injected immutable slot.

## Where it's at

Live on Base Sepolia. Unaudited. It has never held value.

And the part I'd want to read if I were judging this: I set a pass-fail bar for whether the mechanism actually helps LPs before looking at any data, and it does not pass. Two of five criteria fail — 91 positive examples against a floor of 100, and a weakest walk-forward fold of 0.469 against 0.60. The AUC clears at 0.7485. Both failures are sample size, not mechanism, but that distinction is mine to prove and I haven't yet.

The mechanism is built, tested, and deployed. The evidence that it's worth deploying with real capital is not established. Those are different claims and I'm not going to conflate them.

There's also one open High finding, with a working proof of concept: a JIT liquidity provider can add liquidity right ahead of a pending swap, manufacture apparent drift, and collect the inflated surcharge as the dominant in-range LP. The deviation cap bounds which oracle readings get adopted; nothing bounds the pool's own tick, and `MAX_MISPRICING_TICKS` is ten times looser than the cap. Fixing it means a redeploy and a re-mined address, so it's documented and open rather than rushed.

I also built two microstructure signals — realised variance and order-flow imbalance — measured their marginal contribution at −0.008 AUC, and deleted them. Three thousand gas a swap, for nothing. That deletion is the result I'm most confident in.

Publishing only the parts that worked would make everything else here less believable.

Assay is open source, live on Base Sepolia at [assay.prazwal.xyz](https://assay.prazwal.xyz). Thanks to Atrium Academy for the place in UHI10 — the mechanism, the calibration, and the parts I had to delete all came out of that cohort.
