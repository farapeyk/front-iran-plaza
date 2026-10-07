# QA Specialist Roster & Checklist, and Multi-Agent Session Efficiency

> Portable reference: this document describes the specialist review process and
> the multi-agent orchestration practices themselves, not this project's business
> logic. Copy it into any project's `CLAUDE.md` / `docs/` and adapt the
> tech-stack-specific examples in each checklist item.

## Why this exists

A per-diff specialist review (see "Mandatory specialist QA before any commit" in
`CLAUDE.md`) catches most defects — but it has a systematic blind spot: bugs that
don't break the runtime behavior of the diff being reviewed, only a **global
invariant** the diff happens to violate (an API contract, a naming convention, a
security boundary that isn't exercised by the feature's own tests). A reviewer
looking at "does this diff do what it claims" has no reason to also re-check
"did this diff quietly break something unrelated that was already shipped."

Concretely: this project shipped several real bugs of exactly that shape — an
enum name silently renamed by an unrelated later feature, a download URL that
worked in every test (because the test only checked its string shape) but
404'd the moment a real client followed it, a `{id}` path parameter typed as a
string because a view had no class-level `queryset`. Every one of them passed
its own diff's specialist review, because the specialist was correctly
checking "is this diff correct," not "does the whole system's contract still
hold." They were found by an external consumer (a separate frontend team
generating a typed client from the API schema) instead of by us.

**The fix isn't "review harder" — it's adding a short list of global,
mechanical, cheap-to-run checks that don't depend on remembering to think of
them.** A specialist dispatched for a diff that touches the API contract runs
these checks in addition to reviewing the diff's own logic.

## The specialist roster

Pick specialists by what the diff actually touches — not all of them on every
change. A backend-only bugfix doesn't need a marketing review.

| Specialist | Reviews |
|---|---|
| **Database** | Schema/migration safety, index usage, N+1 queries, data-integrity constraints, backward-compatible migrations |
| **Backend** | Business logic correctness, API contract shape, permission/ownership checks, error handling, idempotency |
| **UI/UX** | Screen states (loading/empty/error), accessibility, i18n completeness, established pattern reuse, responsive behavior |
| **Security** | AuthN/authZ boundaries, injection surfaces, secret handling, data exposure, rate limiting |
| **SEO** | (Content-serving projects) metadata, structured data, canonical URLs, crawlability |
| **Marketing** | (Content-serving projects) copy tone, conversion-relevant UI, tracking/analytics wiring |

## The checklist (run whenever a diff touches an API contract or a generated client)

These are **mechanical, global checks** — not "read the diff and think hard,"
but "run this command / grep this pattern and look at the output." Cheap
enough to run on every relevant diff, and they catch a bug class no amount of
diff-reading will, because the bug isn't IN the diff — it's in what the diff
did to something else.

### 1. API schema stability (enum/type naming)

**The failure mode:** two unrelated features each define a choice/enum type
that happens to share a field name. The schema generator silently renames one
of them (often to a hash-suffixed, unstable name) to disambiguate — breaking
every already-shipped consumer of that name, with zero visible diff in either
feature's own code.

**The check:** regenerate the full API schema in strict mode
(this project: `manage.py spectacular --validate --fail-on-warn`; the
equivalent for any OpenAPI/GraphQL-schema-generating stack is "generate the
full schema and fail the build on any naming-collision warning") and diff the
resulting type/enum name list against the last known-good set. Any renamed or
newly-collided name is a regression, even if the diff under review "looks
unrelated." Pin the name explicitly (this project's mechanism:
`SPECTACULAR_SETTINGS["ENUM_NAME_OVERRIDES"]`) the first time two types
collide, not after the fourth time it breaks a consumer.

**Make it permanent, not manual:** write one test that snapshots the full
name set and fails on any drift, so this stops being something a human has to
remember to run (this project's example: `test_openapi_schema_stability.py`).

### 2. Every generated URL is followed by a test, not just shape-checked

**The failure mode:** a serializer method builds a URL by string
interpolation instead of the framework's own reverse-routing helper (this
project: Django's `reverse()`). It passes review because it *looks* right and
its test asserts the string's *shape* (`.endswith("/download/")`) — but the
actual URL is missing a path prefix, or drifts the moment the URL config
changes, and 404s the instant a real client follows it.

**The check:** grep for any URL-returning method that builds the string by
hand (`f"..."` / string concatenation / `%`-formatting with an id) instead of
calling the framework's reverse-routing helper. For every one you find or
write, the accompanying test must make a real request to the returned URL and
assert on the response — not just assert on the string's shape.

### 3. A file-upload field's schema matches what it actually accepts

**The failure mode:** a real multipart file-upload endpoint gets a
default-inferred schema that types the field as a plain string (e.g.
`format: uri`) instead of binary, because nobody told the schema generator
what the field actually is. A generated client then has no way to construct a
request that actually sends a file, even though the endpoint works fine when
tested by hand with a real multipart request.

**The check:** for every endpoint that accepts a file upload, look at its
*generated schema* (not its Python code) and confirm the field is declared as
binary content, not a generic string/URI. Fix by explicitly annotating the
request schema, following whatever your framework's established pattern
already is elsewhere in the codebase — don't invent a second pattern.

### 4. `{id}`-shaped path parameters are typed correctly

**The failure mode:** a view/endpoint scopes its own queryset entirely inside
a runtime method (e.g. `get_queryset()`) with no class-level/static
declaration of what model it serves. The schema generator can't infer the real
type of the path parameter from that, and falls back to a generic `string` —
even though the parameter is really an integer PK, and the endpoint works
perfectly at runtime.

**The check:** the schema-generation step above (#1) surfaces these as an
explicit warning ("failed to infer queryset/model") when run in strict mode —
they don't hide silently the way a naming collision does. Fix by declaring the
model/type statically wherever the framework allows it, even if the runtime
behavior is unchanged.

### 5. Every genuinely-reachable error response is declared, not just the happy path

**The failure mode:** a view's code has a real `if` branch that returns an
error response (404/400/403) under some condition, but the endpoint's
documented/generated schema only describes the success response. A generated
client has no typed shape to branch on for that error, and has to guess or
treat it as an unknown failure.

**The check:** for a business-logic error (not a generic
permission-denied/not-found the framework already documents for you), declare
it explicitly in the schema alongside the success response. Spot-check this
across a few endpoints per review pass rather than trying to be exhaustive —
it's a lower-yield check than the first four, but worth a look whenever a
view's error-branching logic changes.

## Applying this to a new project

1. Identify your stack's equivalent of "generate the full API contract in
   strict/fail-on-warning mode" and run it as a standing check (ideally in
   CI), not a thing someone remembers to do by hand.
2. Adapt the five checks above to your framework's idioms (the failure modes
   are framework-agnostic; the exact tool invocation isn't).
3. Add "does this diff touch the API contract? if so, run the checklist" as a
   trigger condition on your specialist-dispatch rule, alongside the existing
   "which domain does this diff touch" triage.
4. When a consumer (an external frontend team, a partner integration, your
   own generated client) finds a bug of one of these shapes, don't just fix
   the one instance — sweep the whole codebase for the same pattern once,
   and add/extend the check above so the NEXT instance is caught before
   anyone outside the team sees it.

---

## Token efficiency for multi-agent sessions

Observed directly from a long overnight session that ran dozens of concurrent
subagents (feature builds + their own dispatched specialist reviews) against a
shared working tree. The waste here wasn't from any one bad decision — it was
several small, recurring patterns that each seemed reasonable in isolation and
added up. Ranked roughly by how much they actually cost, worst first.

### 1. The "waiting for a notification that will never arrive" stall — the single biggest waste

A subagent dispatches its OWN nested work (a background test run, a second
specialist review it asked for) and then ends its turn saying "I'll wait for
X to notify me." **Nothing notifies a subagent, ever — only the top-level
orchestrator receives completion signals.** A stalled subagent just sits there
until the orchestrator notices and sends it a corrective message, which costs
a full resume-and-reorient cycle — the subagent re-reads its own context to
figure out where it left off, which is not free. This happened dozens of
times in one session, on the same handful of task instances, sometimes four
or five times in a row on the exact same task before it stuck.

**Fix, and put it directly in every subagent's dispatch prompt, not just in a
doc nobody reads mid-task:** "There is no notification mechanism for you. If
you start a background process, poll it yourself in the same turn, or better,
just run it synchronously and wait on the result directly — never end your
turn assuming something will wake you up." Say this explicitly, every time,
for any task that might reasonably involve a test run or a nested review.

### 2. A dedicated specialist sub-agent for every change, including trivial ones

The mandatory-QA-before-commit rule is right for anything with real risk — but
dispatching a full second agent (with its own context-loading overhead: reading
the repo's conventions, the relevant files, running its own test pass) to
review a one-line log-level change or a lint-only fix is disproportionate. Each
such review cost tens of thousands of tokens for something a human would
eyeball in ten seconds.

**Fix:** scale the review to the risk, explicitly. A change with no security/
data implications and an obvious, small diff can be self-reviewed inline by
whoever made it (state in the commit message that this was a low-risk,
self-reviewed change and why) instead of spawning a second agent. Reserve a
dispatched specialist for changes that touch permissions, data integrity, money,
or a genuinely non-obvious piece of logic.

### 3. Full test suites run repeatedly instead of the scoped subset

Several tasks re-ran an entire app's test suite (thousands of tests) on every
iteration of a small, localized change, when running just the directly
relevant test file(s) during iteration — and the full suite once, at the very
end, before committing — would have caught the same regressions for a fraction
of the tokens (test output is real content that goes back into context).

**Fix:** iterate against the smallest test scope that exercises the change;
reserve the full-suite run for the final pre-commit check.

### 4. Redoing work from scratch after an interruption

A background-agent infrastructure hiccup (a transient API timeout) killed
several subagents mid-task. Re-dispatching them with a generic "please do X"
prompt caused some to restart investigation and even code changes from zero,
duplicating work that was already sitting, correct, uncommitted, in the
working tree.

**Fix:** when re-dispatching after any interruption, the very first instruction
is "check `git status`/`git diff` for your own already-in-progress work before
doing anything else, and continue from there rather than starting over" — this
single line saved a large fraction of a redo the moment it was added to this
session's re-dispatch prompts.

### 5. One agent per small task, when several small related tasks could share one dispatch

Each agent dispatch carries fixed overhead before any real work starts:
reading the project's conventions file, orienting in the repo, standing up a
test environment. Splitting five small, related fixes into five separate
agent dispatches pays that fixed cost five times. Batching genuinely related,
similarly-scoped small items into one dispatch (with a clear internal list of
sub-tasks) pays it once.

**Fix:** before dispatching, ask "are there other small, related items
pending that this same agent could reasonably pick up in the same pass?"
Don't over-batch unrelated work into one dispatch either — that makes the
diff harder to review and re-introduces the "which agent broke what" problem
in a shared tree; the judgment call is "related and similarly scoped," not
"everything outstanding."

### 6. Regenerating a shared, non-deterministic artifact more than once

An OpenAPI-schema-derived client regeneration doesn't produce byte-identical
output run to run when several unrelated backend changes are landing
concurrently (auto-generated names can shift). Multiple agents each attempting
the regen, seeing an unexpected diff, investigating, and reverting wasted real
effort on the same non-problem repeatedly.

**Fix:** regenerate shared derived artifacts exactly once, in a single
dedicated pass after the batch of underlying changes has landed and settled —
never as a side effect of an unrelated agent's own task.

### 7. Prefer doing small, low-risk, single-file changes directly instead of dispatching an agent

The highest-leverage version of "don't dispatch an agent for trivial work":
for a change you (the orchestrating session) can read, make, and verify
yourself in a couple of tool calls — a config tweak, a one-line log-level fix,
adding one settings entry — just do it directly. Dispatching an agent for this
pays the same fixed per-agent overhead as item 5 above, for zero benefit over
doing it inline.

### General principle

None of the above is "use fewer agents" as a blanket rule — running many
agents in parallel is exactly right when the work is genuinely independent and
substantial. The waste specifically comes from **fixed overhead paid more
times than necessary** (a stall-and-resume cycle, a dispatch for trivial work,
a full-suite run when a narrow one would do) rather than from parallelism
itself. Match the size of the response — one inline edit, one small dispatch,
one full agent, several parallel agents — to the actual size and risk of the
task.
