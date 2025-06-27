const express = require('express');
const router = express.Router();

const db = require('../config/db');
const { authenticate, authorizeRoles } = require('../middleware/auth.middleware');

// Create a new note
router.post('/', authenticate, authorizeRoles('therapist'), async (req, res) => {
    const { appointment_id, content } = req.body;

    if (!appointment_id || !content) {
        return res.status(400).json({ error: 'Appointment ID and content are required.' });
    }

    try {
        // Prevent duplicate note for same appointment
        const existing = await db('notes').where({ appointment_id }).first();
        if (existing) {
            return res.status(409).json({ error: 'Note already exists for this appointment.' });
        }

        const [note] = await db('notes')
            .insert({
                appointment_id,
                therapist_id: req.user.id,
                content
            })
            .returning(['id', 'appointment_id', 'content', 'created_at']);

        res.status(201).json({ message: 'Note created.', note });
    } catch (err) {
        console.error('Error creating note:', err);
        res.status(500).json({ error: 'Failed to create note.' });
    }
});

// Update existing note
router.put('/:id', authenticate, authorizeRoles('therapist'), async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ error: 'Updated content is required.' });
    }

    try {
        const existing = await db('notes').where({ id }).first();

        if (!existing) {
            return res.status(404).json({ error: 'Note not found.' });
        }

        // Optional: Ensure the note belongs to the requesting therapist
        if (existing.therapist_id !== req.user.id) {
            return res.status(403).json({ error: 'Access denied: not your note.' });
        }

        const [updated] = await db('notes')
            .where({ id })
            .update({
                content,
                updated_at: new Date()
            })
            .returning(['id', 'appointment_id', 'content', 'updated_at']);

        res.json({ message: 'Note updated.', note: updated });
    } catch (err) {
        console.error('Error updating note:', err);
        res.status(500).json({ error: 'Failed to update note.' });
    }
});

// Get a note by appointment ID (therapist-only)
router.get('/:appointmentId', authenticate, authorizeRoles('therapist'), async (req, res) => {
    const { appointmentId } = req.params;

    try {
        const note = await db('notes')
            .where({ appointment_id: appointmentId, therapist_id: req.user.id })
            .first();

        if (!note) {
            return res.status(404).json({ error: 'Note not found or access denied.' });
        }

        res.json({ note });
    } catch (err) {
        console.error('Error fetching note:', err);
        res.status(500).json({ error: 'Failed to retrieve note.' });
    }
});


module.exports = router;


