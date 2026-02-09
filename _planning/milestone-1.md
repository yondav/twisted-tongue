# Milestone 1 - Foundation & Tooling

## Goal

- monorepo scaffolding complete
- linting/formatting stable
- API and web app booting

## Exit Criteria

- pnpm run lint passes
- API starts
- web app starts

## Reflection
### Approach
- Built a monorepo with pnpm + Turborepo to keep shared configs and leave room for iteration.
- Scaffolded a lightweight Express API to protect secrets and enable server‑side logic.
- Chose Vite + React + Tailwind + shadcn for speed and familiarity.

### Why this approach
- Monorepo: not required, but it gives shared tooling, consistent linting, and flexibility if the project expands to more games/features.
- API layer: necessary to protect LLM keys and demonstrates full‑stack comfort.
- Vite/React: fast iteration, no need for SSR in a browser‑centric app.

### What worked well
- Tooling is stable: linting/formatting and dev workflow are set.
- The repo structure makes later work predictable - predictable is scalable.
- Branching strategy is clear and mapped to Linear issues.

### What I learned
- Even in small assessments, investing in tooling early improves velocity and clarity.
- The API layer is worth the overhead.
- A monorepo is heavier than needed but can be justified if you expect iteration or multiple mini‑apps. Using the Turbo starter requires no additional time to get off the ground.

### Tradeoffs
- API layer vs simplicity: added complexity to protect secrets and show server‑side capability.
- Shadcn/Tailwind familiarity vs originality: fast and reliable - make design decisions that matter.
