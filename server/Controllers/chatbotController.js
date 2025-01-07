require('dotenv').config();
// const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// const app = express();
// const port = 3000;

// Initialize the Generative AI SDK
const apiKey = process.env.GEMINI_API_KEY;
console.log("API Key", process.env.GEMINI_API_KEY);
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: 'This is a chatbot which will assist Truck Drivers on Long Haul Operations',
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: 'text/plain',
};

// Start a new chat session
const chatSession = model.startChat({
    generationConfig,
});

// Endpoint for sending a message to the chatbot
const sendMsg = async (req, res) => {
    
    const userMessage = req.body.message;
    try {
        const result = await chatSession.sendMessage(userMessage);
        res.json({ response: result.response.text() });
    } catch (error) {
        res.status(500).json({ error: 'Error processing request.' });
    }
};

module.exports = sendMsg;