const Subject = require('../models/Subject');

exports.createSubject = async (req, res) => {
  try {
    const { title, chapters, priority } = req.body;
    const subject = await Subject.create({
      userId: req.user.id,
      title,
      chapters,
      priority,
    });
    res.status(201).json(subject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ userId: req.user.id });
    res.status(200).json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// This code defines a subject controller with functions to create and retrieve subjects for a user.