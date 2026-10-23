# CloudReady AI ☁️

**An unofficial AZ-900 study coach** built for the #1MillionDevs vibe-coding hackathon. CloudReady AI uses original practice questions, instant explanations, topic-level progress, and a beginner-friendly coach to help learners understand cloud concepts instead of memorising terms.

> This is an independent learning project and is not affiliated with, endorsed by, or an official product of Microsoft. Questions are original practice questions, not real exam questions. Verify current exam scope using the public Microsoft Learn AZ-900 skills outline.

## MVP features

- Dashboard with question attempts, accuracy, sessions, and topic performance
- Three AZ-900 areas: cloud concepts; Azure architecture and services; management and governance
- Original multiple-choice practice questions with explanations for every option
- Weak-topic practice recommendations based on local results
- Study coach with demo responses when no AI key is configured
- Optional OpenAI-compatible API integration through a backend endpoint; API key stays server-side
- Local browser persistence via `localStorage`
- Responsive dark interface

## Run locally

Requirements: Node.js 20+ and npm.

```bash
npm install
cp .env.example .env
npm run dev
```

Vite runs on `http://localhost:5173` and the Express API runs on `http://localhost:3001`. The quiz works without an AI API key; the coach switches to a small demo response set. To enable model-generated coaching, add your provider credentials to `.env`:

```env
AI_API_KEY=your_secret_key
AI_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-4o-mini
PORT=3001
```

Use an API provider and model available to you. Never commit `.env`, put secret keys in React code, or expose them in Vite variables. If deploying the frontend and backend separately, configure a server-side API endpoint and update the frontend API URL/proxy accordingly.

## Build check

```bash
npm run build
```

## Project structure

```text
cloudready-ai/
├── server/index.js       # Express API and protected AI coach endpoint
├── src/main.jsx          # React screens, quiz flow, progress and coach chat
├── src/questions.js      # Original AZ-900 practice question bank
├── src/styles.css        # Responsive UI styles
├── index.html
├── vite.config.js
├── .env.example
└── package.json
```

## Question/content note

The question bank is a small MVP set, written in original wording and mapped to the public AZ-900 skills areas. Expand it only after validating every answer against current Microsoft Learn documentation. The readiness view is a practice indicator, not a prediction or guarantee of passing the certification exam.
 
## Next improvements

1. Validate the question bank against the current official skills outline.
2. Add a larger reviewed question bank and topic filters.
3. Add rate limiting and deployment-specific security controls before public use.
4. Consider optional account-based sync only after the core demo is stable.
