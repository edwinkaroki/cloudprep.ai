# CloudReady AI ☁️

**An unofficial AZ-900 study coach** built for the #1MillionDevs vibe-coding hackathon. CloudReady AI uses original practice questions, instant explanations, topic-level progress, and a beginner-friendly coach to help learners understand cloud concepts instead of memorising terms.

> This is an independent learning project and is not affiliated with, endorsed by, or an official product of Microsoft. Questions are original practice questions, not real exam questions. Verify current exam scope using the public Microsoft Learn AZ-900 skills outline.

## MVP features

- Dashboard with question attempts, accuracy, sessions, and topic performance
- Three AZ-900 areas: cloud concepts; Azure architecture and services; management and governance
- Original multiple-choice practice questions with explanations for every option
- Weak-topic practice recommendations based on local results
- Study coach with demo responses when no AI key is configured
- Optional Gemini API integration through a backend endpoint; API key stays server-side
- Local browser persistence via `localStorage`
- Responsive dark interface

## Run locally

Requirements: Node.js 20+ and npm.

```bash
npm install
cp .env.example .env
npm run dev
```

Vite runs on `http://localhost:5173` and the Express API runs on `http://localhost:3001`. The quiz works without an AI API key; the coach switches to a small demo response set. To enable model-generated coaching, set `GEMINI_API_KEY` in `.env`:

```env
GEMINI_API_KEY=your_gemini_api_key
PORT=3001
```

Never commit `.env`, put secret keys in React code, or expose them in Vite variables. The server currently uses the Gemini model configured in `server/index.js`.

## Build check

```bash
npm run build
```

## Deploy to Render and Vercel

Deploy the API to Render first, then deploy the frontend to Vercel. Both providers should use the repository root as the service/project root.

1. Push this project to a Git repository.
2. In Render, create a Blueprint from that repository. Render will read `render.yaml` and create the `cloudready-ai-api` web service. The health check is available at `/api/health`.
3. Optionally add `GEMINI_API_KEY` to the Render service environment to enable Gemini coach replies. Without it, the API uses its demo replies. Keep the key on Render; do not add it to Vercel or frontend variables.
4. In Vercel, import the same repository and deploy with the Vite settings in `vercel.json` (`npm run build`, output directory `dist`). The rewrite forwards `/api/*` requests to Render.
5. If Render assigns a different public service URL, update the destination in `vercel.json` to `https://YOUR-RENDER-SERVICE.onrender.com/api/:path*`, commit the change, and redeploy Vercel.
6. Open the Vercel site and test the dashboard, a quiz, and the coach. You can also visit `https://YOUR-RENDER-SERVICE.onrender.com/api/health`; it should return JSON with `ok: true`.

The Render free service may take a little time to wake after inactivity. Quiz practice works independently of the coach API, and progress is stored in each learner's browser.

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
