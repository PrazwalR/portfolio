## The problem that started it

Every time I wanted to add token swaps to a Web3 app, I hit the same wall. Uniswap V4 wants you to hand-encode binary UniversalRouter commands and manage a singleton PoolManager with custom Hooks. 1inch Fusion+ is a completely different universe — no on-chain transaction at all, just EIP-712 signatures and a resolver network that executes on your behalf, with HTLC secrets if you're going cross-chain. Paraswap looks friendlier — a REST API — but it comes with zero MEV protection, so your users just get sandwiched and never know it.

Three protocols. Three mental models. Three sets of error handling. Integrate all of them properly and you've burned 3-5 weeks, and you still don't have MEV protection unless you build that yourself too. I'd done this dance enough times that I got tired of doing it again for every new project. That frustration is where SwapKit came from: one SDK, every DEX, zero MEV — describe the intent, let the SDK figure out the routing, the safety, and the execution.

## The idea

The core idea was simple to say and hard to build: developers shouldn't need to know whether their swap ends up going through Uniswap's UniversalRouter, an off-chain 1inch Fusion+ order, or a Paraswap Augustus Router transaction. They should call `sdk.quote()`, get back routes sorted by real net output (after gas and MEV), then call `sdk.swap()` and let the SDK pick the execution path for whichever protocol won.

Underneath, that meant building three pieces that had to talk to each other cleanly:

- A TypeScript SDK with per-protocol adapters, all queried concurrently via `Promise.allSettled` so one dead API doesn't take down the quote.
- A Rust engine for the parts that actually need to be fast and safe: MEV sandwich-risk simulation, slippage optimization, and CREATE2 vanity-address mining for Uniswap V4 hooks (because hook permissions are literally encoded in the leading bytes of the contract address).
- An execution layer that abstracts three genuinely incompatible transaction models — on-chain tx, off-chain signature, on-chain tx-via-aggregator — behind one `.swap()` call.

## Day one hurdles: skeleton to "it compiles"

The first stretch (May 24–27) was the unglamorous part — commits like "blah ntg much," "skeleton built," and then the milestone commit: "successfully built and compiled the entire SDK, React hooks, Rust engine, and Solidity contracts, testing pending." That "testing pending" is doing a lot of work in that sentence. Getting a TypeScript SDK, a Rust Axum server, and Solidity tooling to all build in the same monorepo without fighting each other took longer than writing any individual adapter.

By May 28 the integration tests were passing and I shipped v0.1.0. That felt like the finish line. It was not.

## The first release hurdles

Within a day of publishing, the cracks showed. "Fixed bugs and stubs" and "CLI fixes applied" landed May 29 — small stuff, but it told me the surface area I'd shipped was bigger than what I'd actually tested. Then May 30 brought the first real scare: a critical DoS vulnerability, patched the same day. The Rust mining endpoint (`/mine`) does CPU-intensive Keccak256 brute-forcing across all cores using rayon — exactly the kind of endpoint that, unbounded, lets one client peg your server. That forced in the DoS protections that ended up in the README's Security section: a 64KB payload cap, a semaphore limiting mining to 2 concurrent jobs, a 30-second timeout with atomic-boolean cancellation, and binding the Rust server to 127.0.0.1 by default instead of the open network.

May 31–June 2 was expansion and cleanup at the same time: multi-chain support went in, the last Rust stub implementations got replaced with real logic, and I ran a full security overhaul that took the test suite from 39 tests to 111+. I also pulled the `/quote` endpoint out of the Rust engine entirely — quoting belongs in the TypeScript SDK, calling the real Paraswap/1inch APIs and the on-chain Uniswap Quoter directly. Splitting that cleanly (Rust does risk math, TypeScript does protocol routing) turned out to matter a lot for the next phase.

## The major struggle: getting MEV protection actually correct

This is the part that took the most iteration. On paper, "simulate sandwich risk" sounds like one function. In practice it's a unit-conversion minefield.

The first version of the MEV simulator compared the value a bot could extract against the attacker's gas cost — except the extracted value was denominated in whatever the output token happened to be (say, 6-decimal USDC) while gas cost was in wei. Comparing those directly is like comparing meters to gallons. The bug: a large USDC-output trade would consistently score as "no risk," because the raw USDC number looked small next to a wei-scale gas cost, even when the trade was genuinely juicy for a sandwich bot. I didn't catch this until deep into the audit pass — it's the kind of bug that doesn't crash anything, it just quietly gives wrong answers, which is worse.

The fix (landed June 7-8, alongside the v0.2.0 audit) was to force everything into the chain's native token wei before comparing — ETH on mainnet, MATIC on Polygon, and so on — since that's the actual unit a sandwich bot pays gas in. Token-to-token swaps with no native leg at all now honestly report unknown risk instead of guessing. I also stripped out f64 floating-point math entirely in favor of integer arithmetic, because precision loss in a risk classifier is exactly the kind of thing that looks fine in testing and bites someone in production.

Alongside that, I found and fixed two other quiet correctness bugs in the same audit:

- The Uniswap V4 Quoter ABI was wrong — an extra `sqrtPriceLimitX96` input and mismatched array outputs meant every V4 quote reverted on-chain. Uniswap was silently getting dropped from routing the whole time, and nothing surfaced an error — it just never won a quote comparison. Replaced it with the real `IV4Quoter` ABI, verified against a live mainnet call.
- ERC-20 swaps on Uniswap V4 couldn't actually execute — missing the second Permit2 approval leg (`Permit2.approve(token, UniversalRouter)`), so the router had allowance from the user to Permit2 but not from Permit2 to itself. Every ERC-20-input V4 swap reverted at the last step.

Both of those are the nastiest kind of bug: they don't throw during development if you only test with ETH-in swaps or you don't push the resulting quote all the way to execution. They fail exactly when a real user tries the exact path you didn't manually walk through.

Other security hardening landed in the same window: enforcing slippage bounds of 1-2000 bps on the live execution path (closing a zero-minOut sandwich vector), rejecting non-signer recipients early in `execute()` so funds can't get silently misrouted, defaulting ERC-20 approvals to exact-amount instead of unlimited, and adding an opt-in Flashbots fail-safe for when MEV risk comes back unknown rather than a clean verdict.

## How it's working now

SwapKit today routes concurrently across Uniswap V4, 1inch Fusion+, and Paraswap, picks the best net-output route, runs it through the Rust MEV simulator, and — if sandwich risk comes back high — reroutes the transaction through Flashbots Protect automatically, bypassing the public mempool entirely so bots never see it to attack it. If a protocol is down, it fails open and just returns quotes from what's left. If the Rust engine itself isn't running, the SDK degrades gracefully to static slippage defaults rather than failing the swap.

The numbers as of the v0.2.0 audit: 220+ checks passing — 34 Rust unit/DoS tests, 123 TypeScript regression suites, 28 logic edge cases, 38 live integration tests against real Alchemy and 1inch endpoints, plus full end-to-end execution against a mainnet fork via anvil, covering both directions of a Uniswap V4 swap and the full `/simulate` + `/mine` + DoS matrix on the Rust side.

And on the adoption side — over 4,000 downloads on npm since release, which for a tool built in about two and a half weeks of nights-and-weekends work is more validation than I expected. It's proof the underlying pain (three incompatible DEX integrations plus DIY MEV protection) was real for other people too, not just me.

## What I'd tell past-me

The build-it-fast phase (May 24-28) was the easy part. The real work was everything after v0.1.0 shipped — the DoS patch within 24 hours of release, the audit that took the test suite from 39 to 111 to 220+, and especially the MEV unit-mismatch bug that silently mis-scored risk for months of "working" code. None of those showed up as crashes. They showed up as wrong answers that looked right. If there's one lesson from shipping this, it's that the scariest bugs in a DeFi tool aren't the ones that throw — they're the ones that return a confident, incorrect number and let a user walk into a sandwich attack thinking they were protected.
