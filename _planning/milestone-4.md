# Milestone 4 - Web - Live Transcription + Scoring

## Goal

- real-time speech transcription and gameplay loop
- live scoring with visible feedback
- scoring breakdown that explains the result

## Exit Criteria

- microphone session can start, stop, and reset cleanly
- live transcript updates while speaking
- word-by-word feedback updates during speech and locks on stop
- time + accuracy captured and persisted after a run
- score breakdown available after a completed attempt

## Reflection

### The Plan

- Use the Web Speech API for live transcription and handle lifecycle (start/stop, silence timeout).
- Normalize tokens and compare speech to the target twister in real time.
- Track time and accuracy, then compute a score that is explainable and consistent.
- Provide a score breakdown modal.
- Keep the UI responsive and predictable while API and mic work is happening.

### The Outcome

- Live transcription is implemented in `apps/web/src/contexts/twister/Provider.tsx` with:
  - start/stop/reset handling
  - silence timeout (auto-stop after inactivity)
  - interim + final transcript accumulation
- Live scoring is implemented in `apps/web/src/components/Twister/TwisterGamePlay.tsx`:
  - token normalization
  - correct/incorrect/unstable word states
  - accuracy computed from finalized matches
- Timing is implemented in `apps/web/src/components/Twister/TwisterMetrics.tsx`:
  - live clock during active listening
  - time persisted back into context after stop
- Scoring + breakdown are computed in `apps/web/src/lib/score.ts` and stored in context:
  - expected time derived from word count + difficulty
  - accuracy exponent + time factor to reward accurate/fast performance
  - breakdown modal in `apps/web/src/components/Twister/TwisterScoreBreakdownModal.tsx`
- The control bar now shows either the live clock or a score button:
  - `apps/web/src/components/Twister/TwisterGameControls.tsx`

### What worked well

- The SpeechRecognition loop is stable and handles real-world pauses via the silence timer.
- Token normalization keeps the matching logic readable and produces clean visual feedback.
- The scoring breakdown modal makes the system feel credible and explains the result.
- Context-driven state keeps the gameplay flow consistent across UI surfaces.
- The readiness gating (API + mic) in the splash flow prevents dead-ends and improves UX.

### What went wrong

- Scoring formula churn: the scoring model went through multiple iterations and now includes
  a mixed approach (accuracy exponent + time factor + an additional expected-time adjustment).
  That extra adjustment is functional, but makes the formula less predictable than intended.
- Timing is calculation is converted in the provider, which introduces
  a subtle coupling and makes debugging score calculations harder.
- The score breakdown modal is now instantiated in both `TwisterGamePlay` and
  `TwisterGameControls`, which risks duplicate dialogs and fragmented ownership of the open state - a poor architectural decision. Clear path to cleaning that up.

### Tradeoffs

#### Web Speech API vs. custom audio pipeline

The built-in API is fast to integrate and good enough for the assessment, but it is not
deterministic and varies by browser. There is also the issue of native typing. I'm leaning on `@types/dom-speech-recognition` for this. I can't be certain but with more time, I'd like to have looked into a custom pipeline for this to see if it would have been easier to work with. But overall, I'm satisfied with the result for the sake of the project.

#### Explainable scoring vs. sophisticated scoring

The current formula is intentionally simple and explainable (accuracy + expected time), but it leaves a lot to be desired. A more robust system could consider phonetics, repetition,
and error severity - something I'd consider when iterating.

#### Local UI state vs. global gameplay state

Some state (score modal open) lives locally to keep components simple, but that makes cross-
component coordination harder. A single source of truth would be cleaner long-term. I think the mistake I made here was attempting to include the gameplay state in the context object that handled assembling fetching the twister. I think these concerns could have reasonably been separted.

#### GET /twister for speed vs. POST for clarity

The API uses GET for simplicity and fast iteration. A POST would be more semantically correct
if we were persisting user attempts or expanding request payloads.

### Project-wide reflection

- The monorepo structure (pnpm + Turborepo) keeps tooling consistent and makes shared types
  usable across the API and web apps. I think this architecture is great for a project like this and leaves an easy entry point to revisit for future iteration.
- The API layer is intentionally thin and predictable, with centralized validation and response
  shaping in `apps/api/src/services/twister.ts` and `apps/api/src/services/response.ts`.
- The UI system (Tailwind + shadcn) enabled fast polish and a clear design language. The theming
  system in `apps/web/src/contexts/theming` gave immediate product feel without increasing development time (full transparency - I had a lot of help assembling actual palettes for these themes from chat-gpt. I'd refine those palettes myself if it were a higher priority than wiring up the functionality to implement them).
- The shared `@repo/types` package kept the contracts consistent between server and client, which
  helped reduce drift as scoring and query params evolved.
- The largest risk in the submitted code is scoring calibration. The system works, but the math
  still needs consolidation to avoid surprise scores.

### Final Thoughts

Milestone 4 delivered the core gameplay loop: speak a generated twister, see live feedback,
and receive a score with a clear explanation. The system is functional and the UX is polished.
If I had more time, I would consolidate score state ownership, remove the extra score adjustment,
and add a small set of unit tests for `calculateScoreBreakdown` to lock the scoring behavior.
