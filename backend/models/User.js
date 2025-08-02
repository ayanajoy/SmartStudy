const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

module.exports = mongoose.model('User', UserSchema);
// This code defines a Mongoose schema for a User model with fields for name, email, and password.