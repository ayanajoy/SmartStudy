const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const protect = require('../middleware/authMiddleware');

// Add a new subject
router.post('/', protect, async (req, res) => {
  const { name, chapters, deadline } = req.body;
  if (!name || !chapters || !deadline) {
    return res.status(400).json({ message: 'All fields required' });
  }
  const subject = await Subject.create({ name, chapters, deadline, user: req.user.id });
  res.status(201).json(subject);
});

// Get all subjects for logged-in user
router.get('/', protect, async (req, res) => {
  const subjects = await Subject.find({ user: req.user.id }).sort({ deadline: 1 });
  res.json(subjects);
});

// Delete a subject
router.delete('/:id', protect, async (req, res) => {
  const subject = await Subject.findById(req.params.id);
  if (!subject) return res.status(404).json({ message: 'Subject not found' });
  if (subject.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

  await Subject.findByIdAndDelete(req.params.id);
  res.json({ message: 'Subject removed' });
});

// Update a subject
router.put('/:id', protect, async (req, res) => {
  const subject = await Subject.findById(req.params.id);
  if (!subject) return res.status(404).json({ message: 'Subject not found' });
  if (subject.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

  subject.name = req.body.name || subject.name;
  subject.chapters = req.body.chapters || subject.chapters;
  subject.deadline = req.body.deadline || subject.deadline;

  const updated = await subject.save();
  res.json(updated);
});

module.exports = router;
