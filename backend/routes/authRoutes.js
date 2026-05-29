const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// Regisztráció
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Felhasználónév és jelszó megadása kötelező' });
        }

        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ message: 'Ez a felhasználónév már létezik' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({ message: 'Sikeres regisztráció' });

    } catch (error) {
        res.status(500).json({ message: 'Hiba a regisztráció során' });
    }
});

// Bejelentkezés
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Felhasználónév és jelszó megadása kötelező' });
        }

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Hibás felhasználónév vagy jelszó' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Hibás felhasználónév vagy jelszó' });
        }

        res.json({
            message: 'Sikeres bejelentkezés',
            username: user.username
        });

    } catch (error) {
        res.status(500).json({ message: 'Hiba a bejelentkezés során' });
    }
});

module.exports = router;