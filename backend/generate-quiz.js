// backend/generate-quiz.js
require('dotenv').config();
console.log("MY KEY IS LOADED:", process.env.HF_API_KEY ? "YES!" : "NO :(");
const mongoose = require('mongoose');
const quizService = require('./src/services/quiz.service');

// Paste your sample video notes here!
const sampleTranscript = `
Newton's first law states that every object will remain at rest or in uniform motion in a straight line unless compelled to change its state by the action of an external force. This is known as the law of inertia. The key point here is that if there is no net force acting on an object, its velocity remains constant.
Newton's second law explains how the velocity of an object changes when it is subjected to an external force. The law defines a force to be equal to change in momentum per change in time. For an object with a constant mass, this translates to Force = mass x acceleration (F = ma).
`;

async function generateSample() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('Asking Hugging Face to read notes and generate quiz...');
    const quiz = await quizService.generateAndSaveQuiz({
      title: 'Newtonian Mechanics Video Quiz',
      context: sampleTranscript,
      category: 'JEE',
      difficulty: 'Medium'
    });
    
    console.log('Success! Quiz generated and saved to database.');
    console.log('Quiz ID:', quiz._id);
    process.exit(0);
  } catch (error) {
    console.error('Error generating quiz:', error.message);
    process.exit(1);
  }
}

generateSample();