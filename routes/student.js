const express = require('express');
const Student = require('../models/student');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/my-courses', auth, async (req, res) => {
  const student = await Student.findById(req.user.id);
  res.json(student.courses);
});

router.post('/add-course', auth, async (req, res) => {
  const { courseId, courseName } = req.body;
  const student = await Student.findById(req.user.id);
  const exists = student.courses.find(c => c.courseId === courseId);
  if (exists) return res.status(400).json("Already enrolled");

  student.courses.push({ courseId, courseName });
  await student.save();
  res.json("Course added");
});

router.post('/drop-course', auth, async (req, res) => {
  const { courseId } = req.body;
  const student = await Student.findById(req.user.id);
  student.courses = student.courses.filter(c => c.courseId !== courseId);
  await student.save();
  res.json("Course dropped");
});

router.get('/grades', auth, async (req, res) => {
  const student = await Student.findById(req.user.id);
  res.json(student.courses.map(c => ({
    courseId: c.courseId,
    courseName: c.courseName,
    grade: c.grade || "Not graded"
  })));
});

module.exports = router;
