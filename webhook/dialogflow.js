const express = require('express');
const Student = require('../models/student');
const router = express.Router();

router.post('/dialogflow', async (req, res) => {
  const intent = req.body.queryResult.intent.displayName;
  const email = req.body.queryResult.parameters.email;

  const student = await Student.findOne({ email });
  if (!student) {
    return res.json({ fulfillmentText: "Student not found." });
  }

  if (intent === 'ViewCourses') {
    const courses = student.courses.map(c => c.courseName).join(', ');
    res.json({ fulfillmentText: `Your enrolled courses: ${courses || 'None'}` });
  } else if (intent === 'ViewGrades') {
    const grades = student.courses.map(c => `${c.courseName}: ${c.grade || 'Not graded'}`).join('\n');
    res.json({ fulfillmentText: `Your grades:\n${grades || 'No grades yet.'}` });
  } else {
    res.json({ fulfillmentText: "Sorry, I didn't understand that." });
  }
});

module.exports = router;
