const express = require('express');
const router = express.Router();

const { authenticate, authorizeRoles } = require('../middleware/auth.middleware');

// Example: therapist-only route
router.get('/', authenticate, authorizeRoles('therapist'), (req, res) => {
    res.json({
        message: 'Access granted to protected therapist route.',
        user: req.user
    });
});

module.exports = router;
