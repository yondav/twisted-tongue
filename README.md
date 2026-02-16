# Twisted Tongue

Assignment: Technical Assessment

Client: Tone Labs

Author: Yoni David

- [github](https://github.com/yondav/twisted-tongue)

- [deployed api](https://twisted-tongue-api.vercel.app/)
- [deployed web](https://twisted-tongue-web.vercel.app/)

## Goal

Build an AI Tongue-Twister Coach / Game. The app should use an LLM to generate a unique tongue twister, present it to the user, and then "score" their attempt using live transcription.

Requirements:

AI-Generated Twister: Use any public AI API (OpenAI, Anthropic, etc.) to generate a random, difficult tongue twister based on a user-selected theme (e.g., "sea life," "cooking," "space").

Real-time Transcription: Use the browser's Web Speech API to transcribe the user's attempt live as they speak.

Visual Scoring / Game Dynamics: Compare the live transcription to the generated twister, and create some sort of visually interesting scoring UI. Some ideas: highlight correct words in green and stumbles/misses in red in real-time. Track how fast did the user say the tongue twister, or how many repetitions could they say before messing up, etc. Make this fun.

Performance & State: Focus on the "snappiness" of the UI. How do you handle the delay of the AI generation? How do you manage the lifecycle of the audio stream?

Polished UX: We want to see your "founding engineer" product sense. Make the thing you build a pleasure to use. Make the interface feel like a professional tool—think clean layouts, tactile feedback, and helpful error handling.

---

## Reflection

I used Linear to plan this project and track progress. This helped me identify the primary goals and the potential tradeoffs I would have to make coming into focused development.

Given that this is a technical assessment, I had to reign in some of my natural excitement. I like the assignment and see lots of potential to build something at scale. That influenced some of my architectural decisions which I'm sure we'll talk about as we review.

[Milestone 1 - Foundation & Tooling](./_planning/milestone-1.md)

[Milestone 2 - API - Provider-Agnostic Twister Generation](./_planning/milestone-2.md)

[Milestone 3 - API - Web - Core UI + Theme Flow](./_planning/milestone-3.md)

[Milestone 4 - API - Web - Live Transcription + Scoring](./_planning/milestone-4.md)
