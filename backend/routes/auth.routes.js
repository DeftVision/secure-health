const express = require('express');
const router = express.Router();

const db = require('../config/db');
const {
    hashPassword,
    comparePasswords,
    generateToken
} = require('../services/auth.service');


router.post('/register', async (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({ error: 'Email, password, and role are required.' });
    }

    try {
        // Check for existing user
        const existing = await db('users').where({ email }).first();
        if (existing) {
            return res.status(409).json({ error: 'User already exists.' });
        }

        const hashedPassword = await hashPassword(password);

        const [user] = await db('users')
            .insert({
                email,
                password: hashedPassword,
                role
            })
            .returning(['id', 'email', 'role']);

        const token = generateToken(user);

        res.status(201).json({
            message: 'User registered successfully.',
            user,
            token
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Registration failed.' });
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        const user = await db('users').where({ email }).first();

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const valid = await comparePasswords(password, user.password);

        if (!valid) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const token = generateToken(user);

        res.status(200).json({
            message: 'Login successful.',
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            },
            token
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Login failed.' });
    }
});


module.exports = router;
