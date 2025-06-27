const express = require('express');
const router = express.Router();

const db = require('../config/db');
const { authenticate, authorizeRoles } = require('../middleware/auth.middleware');

router.post('/', authenticate, authorizeRoles('therapist'), async (req, res) => {
    const { start_time, end_time } = req.body;

    if (!start_time || !end_time) {
        return res.status(400).json({ error: 'Start and end time are required.' });
    }

    if (new Date(start_time) >= new Date(end_time)) {
        return res.status(400).json({ error: 'Start time must be before end time.' });
    }

    try {
        const [slot] = await db('availability_slots')
            .insert({
                therapist_id: req.user.id,
                start_time,
                end_time
            })
            .returning(['id', 'therapist_id', 'start_time', 'end_time']);

        res.status(201).json({
            message: 'Availability slot created.',
            slot
        });
    } catch (err) {
        console.error('Error creating availability slot:', err);
        res.status(500).json({ error: 'Could not create availability slot.' });
    }
});


router.get('/:therapistId', authenticate, authorizeRoles('client', 'therapist'), async (req, res) => {
    const { therapistId } = req.params;

    try {
        const slots = await db('availability_slots')
            .where({ therapist_id: therapistId })
            .andWhere('start_time', '>', new Date()) // only future slots
            .orderBy('start_time', 'asc');

        res.json({ slots });
    } catch (err) {
        console.error('Error fetching availability:', err);
        res.status(500).json({ error: 'Could not retrieve availability.' });
    }
});







module.exports = router;
