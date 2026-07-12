const AppError = require('../utils/AppError');
const axios = require('axios');
const https = require('https'); // 1. ADD THIS IMPORT

const HF_API_BASE = 'https://api-inference.huggingface.co/models';
const MODEL = process.env.HF_MODEL || 'mistralai/Mistral-7B-Instruct-v0.2';

// ── Raw call to Hugging Face Inference API (Using Axios) ──
async function callHuggingFace(inputs, parameters = {}) {
  const apiKey = process.env.HF_API_KEY;
  if (!apiKey) {
    throw new AppError('HF_API_KEY is not set. Add it to your .env file.', 500);
  }

  try {
    const response = await axios.post(`${HF_API_BASE}/${MODEL}`, {
      inputs,
      parameters: {
        max_new_tokens:  800,
        temperature:     0.7,
        top_p:           0.95,
        do_sample:       true,
        return_full_text: false,
        ...parameters,
      },
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type':  'application/json',
      },
      timeout: 60000, // Give it 60 seconds to wake up the model
      
      // 2. ADD THIS LINE: Forces Node to use IPv4, bypassing the ENOTFOUND bug
      httpsAgent: new https.Agent({ family: 4 }) 
    });

    const data = response.data;

    if (!Array.isArray(data) || !data[0]?.generated_text) {
      throw new AppError('Unexpected response format from AI model.', 502);
    }

    return data[0].generated_text.trim();

  } catch (error) {
    // If Hugging Face sends an error back (e.g., model loading)
    if (error.response) {
      if (error.response.status === 503) {
        throw new AppError('AI model is warming up. Please try again in 20–30 seconds.', 503);
      }
      throw new AppError(`Hugging Face API error (${error.response.status}): ${JSON.stringify(error.response.data)}`, 502);
    } 
    // If the network drops the connection before reaching Hugging Face
    else if (error.request) {
      console.error("\n❌ NETWORK ERROR DETECTED:", error.message);
      console.error("Your Wi-Fi or ISP is blocking the connection to Hugging Face.");
      throw new AppError(`Network error reaching AI: ${error.message}`, 502);
    }
    
    throw new AppError(`AI Error: ${error.message}`, 502);
  }
}

// ── solveDoubt (RAG) ──
const solveDoubt = async (question, context = '', history = []) => {
  const systemPrompt = `You are NexusPrep AI, an expert tutor for competitive exams like JEE, GATE, and campus placements in India. 
You give clear, step-by-step explanations. You use examples and analogies. 
When solving problems, show all working. Be concise but complete.
${context ? `\nHere are the relevant course notes/transcript for context:\n---\n${context.slice(0, 2000)}\n---\nUse these notes to give a course-specific answer where relevant.` : ''}`;

  let conversationPart = '';
  if (history.length > 0) {
    const recent = history.slice(-8);
    conversationPart = recent.map(msg =>
      msg.role === 'user' ? `[INST] ${msg.text} [/INST]` : msg.text
    ).join('\n') + '\n';
  }

  const prompt = `<s>[INST] ${systemPrompt} [/INST]\n${conversationPart}[INST] ${question} [/INST]`;

  return await callHuggingFace(prompt, { max_new_tokens: 600, temperature: 0.7 });
};

// ── generateQuiz ──
const generateQuiz = async (context, subject = 'General', numQuestions = 5) => {
  if (!context || context.trim().length < 50) {
    throw new AppError('Context is too short to generate a quiz. Provide at least 50 characters of notes.', 400);
  }

  const trimmedContext = context.slice(0, 2500);
  const prompt = `<s>[INST] You are a quiz generator for ${subject} exam preparation.
Read the following notes and generate exactly ${numQuestions} multiple-choice questions.

NOTES:
---
${trimmedContext}
---

CRITICAL RULES:
1. Respond with ONLY a valid JSON array. No explanation before or after.
2. Each question must have exactly 4 options labeled A, B, C, D.
3. correctAnswer must be exactly "A", "B", "C", or "D".
4. explanation must be 1-2 sentences explaining why the answer is correct.
5. Questions should test understanding, not just memorization.

JSON FORMAT (follow exactly):
[
  {
    "text": "question text here",
    "options": [
      {"label": "A", "text": "option A text"},
      {"label": "B", "text": "option B text"},
      {"label": "C", "text": "option C text"},
      {"label": "D", "text": "option D text"}
    ],
    "correctAnswer": "A",
    "explanation": "Explanation of why A is correct.",
    "subject": "${subject}"
  }
]

Respond with ONLY the JSON array, nothing else. [/INST]`;

  const rawResponse = await callHuggingFace(prompt, { max_new_tokens: 1200, temperature: 0.4 });
  return parseQuizJSON(rawResponse, numQuestions);
};

// ── Helpers ──
function parseQuizJSON(rawText, expectedCount) {
  try {
    const parsed = JSON.parse(rawText);
    if (Array.isArray(parsed)) return validateQuestions(parsed);
  } catch (_) {}

  const match = rawText.match(/\[[\s\S]*\]/);
  if (match) {
    try {
      const parsed = JSON.parse(match[0]);
      if (Array.isArray(parsed)) return validateQuestions(parsed);
    } catch (_) {}
  }

  throw new AppError('AI returned an invalid format. Please try generating the quiz again.', 502);
}

function validateQuestions(questions) {
  const valid = ['A', 'B', 'C', 'D'];
  return questions
    .filter(q => q.text && Array.isArray(q.options) && q.options.length === 4 && q.correctAnswer && valid.includes(q.correctAnswer.toUpperCase()))
    .map(q => ({
      text:          q.text.trim(),
      options:       q.options.map(o => ({ label: o.label.toUpperCase(), text: o.text.trim() })),
      correctAnswer: q.correctAnswer.toUpperCase(),
      explanation:   q.explanation?.trim() || '',
      subject:       q.subject?.trim()      || '',
    }));
}

module.exports = { solveDoubt, generateQuiz };