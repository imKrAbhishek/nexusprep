require('dotenv').config(); // Force load .env variables immediately
const { GoogleGenerativeAI } = require('@google/generative-ai');
const AppError = require('../utils/AppError');

// ── solveDoubt (RAG) ──
const solveDoubt = async (question, context = '', history = []) => {
  const apiKey = process.env.GEMINI_API_KEY;

  // Diagnostic check
  if (!apiKey) {
    console.error('❌ ERROR: GEMINI_API_KEY is not defined in process.env');
    throw new AppError('GEMINI_API_KEY is missing in backend .env file.', 500);
  }

  if (apiKey.includes('xxx')) {
    console.error('❌ ERROR: GEMINI_API_KEY contains placeholder "xxx"');
    throw new AppError('GEMINI_API_KEY in .env contains placeholder characters (xxx). Replace with actual key.', 400);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 🔥 REVERTED back to your working model
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
    const systemPrompt = `You are NexusPrep AI, an expert tutor for competitive exams like JEE, GATE, and campus placements. 
You give clear, step-by-step explanations. Use examples and analogies.
${context ? `\nHere are the relevant course notes/transcript for context:\n---\n${context}\n---\nUse these notes to give a course-specific answer where relevant.` : ''}`;

    const fullPrompt = `${systemPrompt}\n\nStudent Question: ${question}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    
    return response.text();

  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new AppError(`AI Error: ${error.message}`, 502);
  }
};

// ── generateQuiz ──
const generateQuiz = async (context, subject = 'General', numQuestions = 5) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.includes('xxx')) {
    throw new AppError('Invalid GEMINI_API_KEY in .env file.', 500);
  }

  if (!context || context.trim().length < 50) {
    throw new AppError('Context is too short to generate a quiz. Provide at least 50 characters of notes.', 400);
  }

  let rawText = "";

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 🔥 REVERTED back to your working model
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });    
    
    const prompt = `You are a quiz generator for ${subject} exam preparation.
Read the following notes and generate exactly ${numQuestions} multiple-choice questions.

NOTES:
---
${context.slice(0, 15000)} 
---

CRITICAL RULES:
1. Respond with ONLY a valid JSON array. No markdown formatting, no backticks.
2. Each question must have exactly 4 options labeled A, B, C, D.
3. correctAnswer must be exactly "A", "B", "C", or "D".

JSON FORMAT:
[
  {
    "text": "question text",
    "options": [
      {"label": "A", "text": "option A"},
      {"label": "B", "text": "option B"},
      {"label": "C", "text": "option C"},
      {"label": "D", "text": "option D"}
    ],
    "correctAnswer": "A",
    "explanation": "Why A is correct.",
    "subject": "${subject}"
  }
]`;

    const result = await model.generateContent(prompt);
    rawText = result.response.text();
    
    // 🔥 THE ULTIMATE JSON PARSING FIX
    const arrayMatch = rawText.match(/\[[\s\S]*\]/);
    
    if (arrayMatch) {
      rawText = arrayMatch[0]; // Isolate the pure JSON array
    } else {
      // Fallback: rigorously strip out markdown code blocks if the regex fails
      rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    }
    
    return JSON.parse(rawText);

  } catch (error) {
    console.error("Quiz Generation Error Details:", error.message);
    console.error("Raw AI Output was:", rawText);
    throw new AppError('Failed to generate quiz. Please try again.', 502);
  }
};

module.exports = { solveDoubt, generateQuiz };