const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./auth'); // Import authentication routes
const cors = require('cors'); // Use CORS for cross-origin requests

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors()); // Enable CORS to allow requests from other origins

// Use authentication routes (register, login)
app.use('/auth', authRoutes);

// Connect to MongoDB database using the connection string from .env
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection failed:', err));

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
