const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  courses: [
    {
      courseId: String, // could also be ObjectId if linking to a separate Course model
      courseName: String,
      grade: String // e.g., "A", "B+", etc.
    }
  ]
});

module.exports = mongoose.model('Student', studentSchema);
