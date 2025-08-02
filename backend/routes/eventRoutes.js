const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const Event = require('../models/Event');

// Get all events for the logged-in user
router.get('/', protect, async (req, res) => {
  const events = await Event.find({ user: req.user.id });
  res.json(events);
});

// Add an event
router.post('/', protect, async (req, res) => {
  const { title, start, end } = req.body;
  const newEvent = await Event.create({
    title,
    start,
    end,
    user: req.user.id,
  });
  res.status(201).json(newEvent);
});

// Delete an event
router.delete('/:id', protect, async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event || event.user.toString() !== req.user.id) {
    return res.status(404).json({ message: 'Event not found or unauthorized' });
  }
  await event.remove();
  res.json({ message: 'Event deleted' });
});

module.exports = router;
