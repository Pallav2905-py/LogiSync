const mongoose = require('mongoose');

// Connection URI
const uri = 'mongodb+srv://imrankotwal232:Q4P2f0tTarhL4NiY@cargosync.fsvyh.mongodb.net/?retryWrites=true&w=majority&appName=CargoSync';

// Options for the connection


// Async function to connect to MongoDB
const connectToDatabase = async () => {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
};

// Call the async function
module.exports = connectToDatabase;