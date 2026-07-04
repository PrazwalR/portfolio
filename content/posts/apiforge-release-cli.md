## The problem that started it

Every API service I shipped had the same ritual: bump the version, write the changelog, commit, tag, push, build the Docker image, push it, patch the Kubernetes deployment, wait for the rollout, hit the health endpoint a few times, post in Slack, and, if any single one of those steps went sideways, manually figure out what state everything was in and undo it by hand. Ten-plus manual steps, every release, across multiple repos, and every one of them was a place to fat-finger a version string or forget to roll back a half-applied deployment.

The idea was simple: what if all of that was one command, and if it failed halfway through, it undid itself?

That's Apiforge, merged code in, healthy pods in production out, one command.

## The initial hurdle: what even is a "step"?

The first design problem wasn't Docker or Kubernetes, it was the shape of the abstraction. I didn't want thirteen bespoke scripts glued together with bash and hope. I wanted one pipeline where every stage plays by the same rules: check before you run, run, show me what you'd do without doing it, and undo yourself if asked.

That became a `Step` trait (`src/steps/mod.rs`) with four methods: `validate()`, `execute()`, `dry_run()`, and `rollback()`. Once that contract existed, `git-preflight`, `version-bump`, `docker-build`, `k8s-rollout`, `github-release`, notifications, all of it became implementations of the same shape instead of one-off logic. The orchestrator validates every step *before* touching anything (fail fast, before any mutation), executes in order, and on failure walks back completed steps in reverse. That one decision, commit to the trait early, is what made rollback possible later without a rewrite.

The earliest commits tell the story plainly: `working skeleton` → `Implemented git operations` → `Implemented Docker, K8s, AWS, GitHub integrations` → `Implement real K8s deployment rollback` → `Add automatic rollback on pipeline failure`, all inside about three weeks. That's the whole spine of the tool, built in the order a real release actually happens.

## First release, first reality check

Getting `v0.1.0` out was its own war. The commit log right before that tag is blunt about it: `Fix critical issues, add comprehensive README, prepare for v0.1.0 release`. Then immediately after: `Update dependencies for security patches`.

Then came the part nobody warns you about when you write a cross-platform CLI: CI. A wall of commits, `Clippy fixes`, `Cross-platform Docker improvements`, `Git Timeouts & Audit Retry`, `Fix rustfmt and add Cargo.lock for security audit`, `Fix CI for Rust 1.70.0 MSRV compatibility`, `CI stabilization patch`, `upgrade upload-artifact to v7 and fix dependabot config`, spanning v0.2.1 through v0.2.4 alone. The recurring villain was matrix builds: macOS Intel binaries built on an arm64-hosted `macos-latest` runner would silently produce broken links, Linux ARM64 cross-compiles choked without OpenSSL dev headers in the container, and `openssl-sys` detection failed on macOS runners missing `pkg-config`. Each of those got its own dedicated runner in the release matrix, `macos-13` for x86_64, `macos-14`/`macos-15-intel` for the others, `ubuntu-24.04-arm` for native ARM64, because cross-compiling reliably across five target platforms turned out to be harder than writing the actual release logic.

## The major coding struggle: rollback that's actually safe

The hardest problem in the whole codebase wasn't any individual integration. It was rollback semantics. "Undo what you just did" sounds simple until you ask: undo *how*, exactly, when one of the things you did was push to a shared git remote that other people might already be pulling from?

The naive answer, force-push to erase the bad commit and tag, is exactly the kind of thing that nukes a coworker's in-progress branch. So I made a deliberate, documented trade-off: rollback restores local state (version file bytes reverted byte-for-byte, `git-commit` soft-reset to the parent, tags deleted locally and remotely) but **never rewrites pushed commit history**. Only the release marker tag gets removed. It's a known limitation, called out explicitly in the README, instead of a landmine someone finds three months later.

Kubernetes rollback had its own sharp edges. Early on I rolled back *both* `k8s-update` and `k8s-rollout` on failure, which meant a single failed rollout could revert the deployment two ReplicaSet revisions back instead of one, silently reintroducing an even older bug. Fixed by making rollback single-owned: only `k8s-update` reverts the revision, `k8s-rollout`'s rollback is a no-op. Smaller but nastier: `k8s-rollout` divided by replica count to compute readiness percentage, and a deployment scaled to zero replicas turned that into a division-by-zero panic mid-release, the exact moment you don't want a panic.

Then there was the bug that almost defeated the entire audit system before it shipped: Apiforge's own `.apiforge/audit` directory (where it records release history) tripped its own `require_clean` git preflight check. The first successful release would write an audit record, and every release after that would refuse to run because the working tree was "dirty", dirty with the tool's own bookkeeping. Fixed by git-ignoring `.apiforge/` and having `init` add it automatically. It's the kind of bug that only exists because the tool works. You don't hit it until it's already recorded a successful run.

Secrets were the other long tail: `${VAR}` references in config used to fail deep inside a step as an opaque "auth error" if a token was missing. By the time you saw the failure, git had already been pushed. Now every `${VAR}` and `${ssm:/path}` reference resolves at config load, before anything mutates, naming the missing variable directly. AWS SSM resolution (with KMS decryption) and CloudFront cache invalidation after rollout came later, in v0.4.0, once the core loop was trustworthy enough to build more onto.

## How it works now

`apiforge release patch` runs preflight, bumps the version file for whatever language you're in (Rust, Node, Python, Go, Java), generates the changelog, commits, tags, pushes, builds and pushes the Docker image, patches the Kubernetes deployment and waits for rollout (with live replica-count progress on a real terminal, plain lines in CI), invalidates CloudFront if configured, cuts a GitHub release, and runs the health check, then records everything to an embedded `sled` audit store and fires Slack/webhook notifications on success *or* failure. `--dry-run` simulates every step, file diffs and all, with zero side effects. If it fails anywhere past preflight, it unwinds everything it already did, in reverse, automatically. `apiforge rollback` with no arguments figures out the right older version on its own from audit history or semver tags, patches the deployment, and re-verifies health.

## Where it's at

It's on crates.io now, past 200 downloads, currently at v0.4.0. The commit history is basically a diary of every way a release pipeline can quietly betray you: division by zero on a scaled-down deployment, a tool that locks itself out with its own audit trail, force-pushes that would've clobbered a teammate's branch, JSON output that wasn't actually clean JSON because progress logs leaked onto stdout. Every one of those is fixed and has a test or a documented limitation now instead of being a surprise waiting for the next person.

The honest limitations are still in the README, not hidden: no multi-environment config profiles yet (use separate config files with `--config` for now), and rollback still needs either local audit history or semver tags to auto-target, bring-your-own `--to` if a fresh machine has neither.
