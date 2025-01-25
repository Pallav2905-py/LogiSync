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
// const sendMsg = async (req, res) => {

//     const userMessage = req.body.message;
//     try {
//         const result = await chatSession.sendMessage(userMessage);
//         res.json({ response: result.response.text() });
//     } catch (error) {
//         res.status(500).json({ error: 'Error processing request.' });
//     }
// };

// module.exports = sendMsg;

const Groq = require('groq-sdk');

// const groq = new Groq();
const groq = new Groq({ apiKey: "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" });

const sendMsg = async (req, res) => {
    const userMessage = req.body.message;

    try {
        // Use Groq to create a chat completion
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: userMessage }
            ],
            model: "llama-3.3-70b-versatile", // Specify the model
            temperature: 1,                   // Adjust creativity level
            max_completion_tokens: 1024,      // Set maximum token limit for response
            top_p: 1,                         // Top-p for diversity
            stream: false                     // Streaming disabled for this endpoint
        });

        // Extract and return the response text
        const responseText = chatCompletion.choices[0]?.message?.content || "I'm sorry, I couldn't understand that.";
        res.json({ response: responseText });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Error processing request.' });
    }
};

module.exports = sendMsg;
