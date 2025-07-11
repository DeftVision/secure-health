require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const db = require('./config/db');
const authRoutes = require('./routes/auth.routes');

const app = express();
const port = process.env.PORT || 5001;
const protectedRoutes = require('./routes/protected.routes');
const availabilityRoutes = require('./routes/availability.routes');
const appointmentRoutes = require('./routes/appointments.routes');
const notesRoutes = require('./routes/notes.routes');






// Security & parsing middleware
app.use(helmet());             // Sets secure HTTP headers
app.use(cors());               // Allows cross-origin requests
app.use(express.json());       // Parses incoming JSON
app.use(morgan('dev'));        // Logs HTTP requests (dev format)

app.use('/auth', authRoutes);
app.use('/protected', protectedRoutes);
app.use('/availability', availabilityRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/notes', notesRoutes);




// Base route
app.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()');
        res.status(200).json({ message: 'Secure Health API is running.', time: result.rows[0].now });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database connection failed' });
    }
});


// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
