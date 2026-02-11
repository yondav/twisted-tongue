# Milestone 2 - API - Provider-Agnostic Twister Generation

## Goal

- one stable API endpoint that hides provider choice and enforces output shape
- provider adapter pattern with a default provider when chosen

## Exit Criteria

- `GET /twister?theme=...` returns a validated twister
- error handling for missing env, provider failure, invalid theme
- structured logs and timeouts

## Reflection

### The Plan

- A provider-agnostic API with an adapter layer and a single `/twister` endpoint that hides provider choice.

### The Outcome

- A single consolidated service that owns the full generation flow:
  - input validation
  - provider selection
  - prompt construction
  - OpenAI call
  - output normalization
  - response shaping
- OpenAI-first integration (gpt-4o-mini) with mock as a user selectable fallback, not a hidden default.
- Provider selection is explicit in the route via `provider` param, rather than fully abstracted from the client.
- Response shaping is standardized through `ResponseService`, so controllers stay thin and predictable.
- `/ready` endpoint checks for `OPENAI_API_KEY` to support client UX decisions around fallback.

### Why the shift

- The assessment benefits from clarity over extensibility. A single, well-documented service is easier to explain, test, and reason about than a multi-adapter abstraction.
- OpenAI was the fastest path to a real working LLM integration, and gpt-4o-mini offered a good cost/latency balance.
- The mock provider is still useful, but made explicit to avoid surprising behavior by rejecting custom `theme` input.

### Tradeoffs

#### God-object service vs modular layers

Chose a single service to reduce scattered logic and make the flow easy to explain as we review the assignment. For a proof of concept, I think this serves me well. For scalability, I think this could easily be abstracted with minimal effort.

#### Provider-agnostic design vs OpenAI-first

Dropped the fully generic adapter approach to ship a working integration quickly. Kept enough structure to re-introduce adapters later if I choose to iterate in the future.

#### Explicit provider selection vs hidden fallback

Exposing `provider` in the API lets the UI decide what to do when OpenAI fails. This is more transparent than silently falling back to the mock.

#### Prompt/pipeline centralized vs shared helpers

Consolidated prompt and validation in the service to keep a single source of truth. This reduces reuse but improves readability for review.

#### Readiness check in API

Added `/ready` to let the client decide whether to show OpenAI or mock options, instead of blocking the app from starting.

### Final Thoughts

I think this is the right way to approach this layer of the application, given the assignment. I've outlined my initial direction vs where I landed and I think that I'm well positioned to explain my work to this point and move into the next phase of development on the client-side.

One thing I may revisit is the `/twister` endpoint, currently a `GET`. I'm conflicted on this as it feels like it should be a `POST` but we are not actually writing anything. I will come back to this as I decide how I want to handle the payload on the client-side, considering simplicity vs scalability.
