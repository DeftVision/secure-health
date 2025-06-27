require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 5001;

// Security & parsing middleware
app.use(helmet());             // Sets secure HTTP headers
app.use(cors());               // Allows cross-origin requests
app.use(express.json());       // Parses incoming JSON
app.use(morgan('dev'));        // Logs HTTP requests (dev format)

// Base route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Secure Health API is running.' });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
