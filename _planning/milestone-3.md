# Milestone 3 - Web - Core UI + Theme Flow

## Goal

- polished UI shell
- theme selection
- twister display

## Exit Criteria

- user can select a theme and request a tongue twister
- loading, empty, and error states are visible and helpful

## Reflection

### The Plan

- Build a clean, responsive UI shell and wire the form to the API.
- Keep the flow simple and fast: select -> generate -> read.

### The Outcome

- Built a responsive shell with a compact toolbar + stacked content layout.
- Implemented a theme system with multiple palettes and light/dark/system mode.
- Added a splash entry flow with readiness + microphone gating before gameplay.
- Wired the twister request flow using axios + react-query + context.
- Built a collapsible toolbar for small screens with a summary row and inline Generate.

### What I learned

- A strong entry flow (splash + readiness) makes the app feel intentional and safe.
- Consolidating request state into context keeps the UI predictable and easy to test.
- Theme systems are inexpensive and boost product polish immediately.

### What I chose to pull in early from later milestones

- Basic readiness + error UI for OpenAI and microphone flow (Milestone 4 scaffolding).
- Visual polish (theme palettes, typography, transitions) ahead of gameplay features (Milestone 5 polish).

### Tradeoffs

#### Simple toolbar vs full form

Chose a compact toolbar with a collapsible mobile form to keep the UI clean on small screens. It adds a bit of state, but improves usability and keeps the top of the page focused.

#### Theme system early vs later

I pulled the theme work forward because it pays off quickly for the assessment. It added some complexity in CSS, but it made the UI feel more intentional without slowing core development.

#### Context-driven requests

I centralized twister requests in a provider to avoid prop drilling and to align status handling across the app. This will make live scoring integration easier later.

### Final Thoughts

Milestone 3 is functionally complete. The UI is responsive, the theme flow works, and the twister request path is wired. The next steps are focused on live microphone transcription and scoring (Milestone 4) and adding a minimal gameplay loop and summary (Milestone 5).
