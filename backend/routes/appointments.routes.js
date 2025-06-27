const express = require('express');
const router = express.Router();

const db = require('../config/db');
const { authenticate, authorizeRoles } = require('../middleware/auth.middleware');

router.post('/', authenticate, authorizeRoles('client'), async (req, res) => {
    const { slot_id } = req.body;

    if (!slot_id) {
        return res.status(400).json({ error: 'Availability slot ID is required.' });
    }

    try {
        // Check slot exists
        const slot = await db('availability_slots').where({ id: slot_id }).first();
        if (!slot) {
            return res.status(404).json({ error: 'Availability slot not found.' });
        }

        // Check if already booked
        const existing = await db('appointments').where({ availability_slot_id: slot_id }).first();
        if (existing) {
            return res.status(409).json({ error: 'This slot is already booked.' });
        }

        const [appointment] = await db('appointments')
            .insert({
                client_id: req.user.id,
                therapist_id: slot.therapist_id,
                availability_slot_id: slot.id
            })
            .returning(['id', 'client_id', 'therapist_id', 'availability_slot_id']);

        res.status(201).json({
            message: 'Appointment booked successfully.',
            appointment
        });
    } catch (err) {
        console.error('Booking error:', err);
        res.status(500).json({ error: 'Failed to book appointment.' });
    }
});

module.exports = router;
