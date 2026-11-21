## The problem that started it

Liquidity providers on an AMM sell to whoever trades with them, and some of those traders know more than the pool does. When ETH moves on a centralised exchange, the pool's price is stale for a few seconds. An arbitrageur trades against that stale price, and the profit comes straight out of LPs' pockets. This is the oldest problem in AMM design. It's a big reason passive liquidity so often loses money once fees are counted.

The usual responses all charge the wrong people. A higher static fee taxes everyone, including the retail swap that knew nothing. A dynamic fee guesses at toxicity before the trade happens, so it guesses wrong in both directions. Auctioning the first swap in each block helps, but only covers one slice of the problem.

I wanted a pool that charges arbitrage what it actually took, measured afterwards against an outside price, and refunds everyone else.

## The idea

Touchstone is a Uniswap v4 hook. Most swaps pass through untouched. When a swap looks informed, the hook holds a small refundable deposit out of that swap's own output, in the same transaction. A swap looks informed when it is:

- the first large trade in a block,
- part of a one-sided burst of flow,
- a trade toward the Chainlink price,
- a trade while the market is closed.

The hook writes down what happened and commits the record by hash.

A few seconds later, anyone can settle that record against a signed Pyth price. If the trade beat the outside price by more than a margin, part of that excess is kept: most of it vests to LPs, and a slice pays whoever settled it. Everything else goes back to the trader. A trade that turns out benign is refunded in full and can earn a rebate. If nobody settles it in time, it expires to a full refund. Neither the trader nor the keeper chooses the oracle price; the contract does.

Underneath that sit three layers:

- **Contracts.** The hook, a Settler that verifies Pyth updates and computes the markout, a factory, a lens for quotes, a guarded router, a rebate ledger, and an auction that leases one arbitrageur an exemption with the rent paid to LPs.
- **Services.** A keeper that settles and expires records, an indexer with a history API and alerts, and demonstration bots.
- **Evidence.** Pre-registered research on historical Uniswap data, a dashboard that walks a real swap through settlement, and a Rust engine that replays the deployed bytecode.

## Before writing any code: the research

I didn't want to build a mechanism and then go looking for numbers that flattered it. So the experiments were registered and hashed before they ran, and each result records the registration hash, the analysis-code hash and the SHA-256 of every input dataset. Thresholds never change after a run.

**E1 (descriptive).** 209,406 swaps from 30 August to 27 September showed where the damage actually sits. Swaps of $25,000 or more carried 97% of toxic markout. The 72% of swaps under $5,000 carried 0.3%. Small trades almost never hurt LPs, so the trigger could ignore most traffic.

**E2 (held-out test).** On 184,145 swaps from 27 September to 25 October, the trigger caught 98.9% of toxic flow (95% interval 98.6% to 99.2%). It flagged 23.4% of swaps, carrying 89.6% of volume.

Two experiments didn't go my way. E6 compared pool freshness against a static-fee pool in simulation, and all 21 registered cases failed the threshold. E5 tested evasion: when a trade is split into pieces under a tenth of the minimum size and delayed, recall in simulation falls to about 10%. Both results are published next to the pass. That cost me a cleaner story. Keeping it is the point of pre-registering.

## The 24,576-byte wall

Ethereum caps deployed contract code at 24,576 bytes, and the hook ran into that cap again and again.

The first full build of the hook compiled to 29,326 bytes under the default optimiser settings. Switching the hook to the IR pipeline at 200 optimiser runs brought it to 19,726. That bought room, but the room kept shrinking. By the time the licence auction's fast path was in, the hook was 24,437 bytes, 139 bytes from the limit, with the quote interfaces still to come.

The fix was to move work out of the hook entirely. Deposit previews moved to a separate lens contract. The hook keeps a one-line forwarder because only it knows whether this transaction already made the block's first touch. The quote standard's four functions are served through the hook's fallback instead of four forwarders, since every external function costs bytecode. The deployed hook is 23,993 bytes.

That decision had a side effect I wrote down and then forgot. Because the hook compiles under its own profile, a test that imports the hook source drags everything it touches into a second compile. That came back to bite me later.

## The bug that looked handled

At the end of October I ran a structured internal audit, and it found the worst bug in the project. The code it lived in already had error handling, which is why it got past me.

Refunds in native ETH were paid inside the hook's PoolManager unlock with a try/catch. If the recipient reverted, the catch sent the refund to the ledger instead. That covers a recipient that refuses payment. It does not cover a recipient that accepts payment and quietly changes PoolManager state.

The proof of concept was three lines in a `receive()` function. When paid, the beneficiary calls `PoolManager.mint` for one unit. The refund call returns successfully, so the catch never fires. But it leaves an unsettled balance, and the outer unlock reverts with `CurrencyNotSettled` at the very end, outside the try. The beneficiary only needs to do this when the refund is smaller than the full deposit. Any settlement that would keep part of the deposit therefore always reverts. The arbitrageur waits for expiry and takes the whole deposit back.

In other words, the whole mechanism could be switched off by the people it was built to charge. A version that always stalled also locked records forever and filled the pool's deposit cap at no cost to the attacker.

The fix was to stop handing control to a trader-chosen address while the hook holds the unlock. Refunds and tips are now credited to the rebate ledger as ERC-6909 claim transfers, which run no receiver code. The actual push happens after settlement completes. The same audit found that the settlement maths left out the executed swap fee, and that the in-the-money correction was applied even to swaps that never overshot the fair price. Both were fixed with regression tests.

Some findings needed a decision about the mechanism itself rather than a code fix, and they're still open: self-LP wash trading to farm rebates, LPs adding liquidity just before a drip to catch it (JIT capture), and exhausting the deposit cap. They're recorded as unresolved, not quietly accepted.

## Coverage that lied, twice

`forge coverage` on an IR-compiled hook needs `--ir-minimum`, and under that flag calls into internal libraries often aren't attributed. Libraries fuzzed thousands of times reported 55 to 65% coverage. On 1 November the whole of `src/` measured 74%. I wrote direct unit harnesses for each library function, reviewed every remaining excluded line by hand, pinned those reviews to the exact source text, and gated CI at 95%. It reached 99.6% of lines and 99.3% of branches.

Then on 11 November CI went red with coverage at 66%. The cause was one line. I had added a `DepositReasons` event to the hook, and the test that checked it imported the hook source just to name the event. That's exactly what the compiler-profile decision warned about. Every shared contract was compiled twice, once per profile, and coverage split its hits across the two copies. The same duplication renamed a build artifact, so the indexer's end-to-end test couldn't find `PoolSwapTest.json` and failed in a completely different part of CI. Declaring the event in the test instead of importing the hook fixed both.

## Testnet: a real price that looked fake

The first demo pool on Arbitrum Sepolia had one full-range position of 10 USDC. The testnet thresholds were scaled down a thousand times; the liquidity wasn't scaled to match. A 6 USDC demonstration swap could more than double the price. By 7 November the pool sat at 4.07 USDC per ETH against a Chainlink price of 2,230.51.

Every number on the dashboard was a real on-chain read, and every number looked fabricated. I re-seeded the pool with a concentrated band around the reference price on top of a thin full-range backstop.

Four days later the simulation page was broken again, for two reasons:

- **The band drifted.** It was fixed at ±3% of the 7 November price, and ETH had since fallen below it.
- **Anyone could withdraw it.** The liquidity had been added through Uniswap's open test router, which owns every position it creates and pays whoever removes one. On a fork of the live chain, an unrelated account withdrew the whole 60 USDC band in one call.

The liquidity now sits in a vault only the deployer can change. A recentre script moves the price back onto Chainlink and re-seeds the band, after rehearsing on a fork first. On the fork it brought a pool dumped to 3.46 back to the Chainlink price.

## The keeper

Settling is permissionless, but somebody has to do it, so there's a reference keeper. It has a Node version and a Cloudflare Durable Object version that journals in-flight transactions so a restart never double-sends.

Its worst bug was self-inflicted rate limiting. When the keeper declined to settle a record, for example because the edge sat inside Pyth's confidence band, it asked Hermes for two fresh price updates for that record on every tick. Declined records piled up until Hermes rate-limited the keeper out of settling new ones. Declined records now back off before being looked at again. The Workers version had its own classic bug: calling `fetch` without its receiver throws `Illegal invocation`, and the keeper now reports that case by name.

## How it's working now

Touchstone is deployed on Arbitrum Sepolia, with all seven contracts verified on Arbiscan. As a testnet demonstration, the hook has seen 14 swaps on its demo pool and held a deposit on 13 of them. Seven settled with part of the arbitrage edge vested to LPs. Five were judged benign and refunded in full. One went unsettled and expired to a full refund.

The test suite has 264 contract tests (unit, adversarial, differential, integration, gas, fork and 11 invariant tests) and 109 backend tests, including Anvil end-to-end suites. CI also runs a gas regression gate, the coverage gate, Slither against a triaged baseline, and dependency audits.

It's still unaudited and testnet only. The backtest shows the trigger detects informed flow; it does not show LPs earn more, and on the held-out weeks LPs were already ahead net of fees, so that comparison can't tell. Testnet swaps say nothing about LP returns either. Ex-post markout settlement also has prior art in Hindsight. What's new here is the combination: a signed outside price the contract chooses, deposits taken only from flagged swaps, settlement when the market is closed, the licence, and rebates for benign flow.

## What I'd tell past-me

None of the bugs that mattered crashed anything.

- The refund path had a try/catch, so it looked handled, and it let arbitrageurs switch the mechanism off.
- The demo pool showed a true price that looked like a lie.
- One import silently halved the measured coverage and broke a test in another package.
- The keeper didn't fail; it slowly rate-limited itself into doing nothing.

The lesson I keep relearning is that "handled" and "correct" are different claims, and only the second one counts. The other lesson is to write the failures down where people can see them. A pre-registered experiment that failed is worth more than one that passed after the threshold moved.

Live app: [touchstone.prazwal.xyz](https://touchstone.prazwal.xyz) · Code: [github.com/PrazwalR/Touchstone](https://github.com/PrazwalR/Touchstone)
