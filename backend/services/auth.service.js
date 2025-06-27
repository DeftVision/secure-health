const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 12;

async function hashPassword(password) {
    return await bcrypt.hash(password, SALT_ROUNDS);
}

async function comparePasswords(plain, hashed) {
    return await bcrypt.compare(plain, hashed);
}


function generateToken(user) {
    return jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );
}


function verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}


module.exports = {
    hashPassword,
    comparePasswords,
    generateToken,
    verifyToken
};
