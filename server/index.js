
import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(express.json({ limit: '1mb' }));

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

const SYSTEM_PROMPT = `
You are CloudReady AI, an unofficial AZ-900 study coach for beginners.

Explain Azure and cloud concepts accurately, simply and patiently.
Use relatable African examples when useful, such as a Kenyan school
computer lab, matatu SACCO or small business.

Focus on these AZ-900 areas:
1. Cloud concepts
2. Azure architecture and services
3. Azure management and governance

Use original educational examples. Never claim to provide real
Microsoft exam questions or guarantee that a learner will pass.

Explain why concepts matter, compare confusing terms, and correct
misconceptions respectfully. If uncertain, say so and direct learners
to the official Microsoft Learn AZ-900 skills outline.

Keep responses readable and concise.
`;

const demoCoachReply = (message) => {
  const m = message.toLowerCase();

  if (m.includes('capex') || m.includes('opex')) {
    return 'Think of a cybercafé. CapEx is buying computers upfront, while OpEx covers ongoing operating expenses. Cloud services can shift some spending toward operating expenses, depending on the arrangement.';
  }

  if (m.includes('policy') || m.includes('lock')) {
    return 'Azure Policy helps assess or enforce rules for Azure resources. Resource locks help prevent accidental deletion or modification. Policy focuses on compliance; locks protect resources from certain operations.';
  }

  return 'Ask me about a specific AZ-900 concept, and I will break it down step by step.';
};

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, aiConfigured: Boolean(ai) });
});


app.post('/api/coach', async (req, res) => {
  const message = String(req.body?.message ?? '').trim();
  const history = Array.isArray(req.body?.history)
    ? req.body.history.slice(-8)
    : [];

  if (!message) {
    return res.status(400).json({
      error: 'Please enter a question.'
    });
  }

  if (message.length > 3000) {
    return res.status(413).json({
      error: 'Please keep your question under 3,000 characters.'
    });
  }

  if (!ai) {
    return res.json({
      reply: demoCoachReply(message),
      mode: 'demo'
    });
  }

  try {
    const conversation = history
      .filter(x =>
        ['user', 'assistant', 'model'].includes(x?.role) &&
        typeof x?.content === 'string'
      )
      .map(x => ({
        role: x.role === 'assistant' || x.role === 'model'
          ? 'model'
          : 'user',
        parts: [{ text: x.content.slice(0, 3000) }]
      }));

    conversation.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: conversation,
      config: { systemInstruction: SYSTEM_PROMPT.trim() }
    });

    const reply = response.text?.trim();

    if (!reply) {
      console.error('Gemini returned no text:', response);

      return res.status(502).json({
        error: 'Gemini returned an empty response. Please try again.'
      });
    }

    return res.json({
      reply,
      mode: 'ai'
    });
  } catch (error) {
    console.error('Gemini request failed:', error);

    return res.status(502).json({
      error: 'The AI coach could not respond. Please check the server terminal.'
    });
  }
});

const port = Number(process.env.PORT) || 3001;

app.listen(port, '0.0.0.0', () => {
  console.log(`API server listening on port ${port}`);
});
