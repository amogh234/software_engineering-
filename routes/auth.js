const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/student');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const student = new Student({ username, email, password: hash });
    await student.save();
    res.status(201).json("User registered");
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });
    if (!student) return res.status(404).json("User not found");

    const match = await bcrypt.compare(password, student.password);
    if (!match) return res.status(400).json("Invalid credentials");

    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, user: { id: student._id, username: student.username } });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;
