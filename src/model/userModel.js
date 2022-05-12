const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
    required: [true, 'A User must have a name'],
  },
  email: {
    type: String,
    maxlength: 50,
    unique: true,
    required: [true, 'A user must have an email address'],
  },
  company: {
    type: String,
    maxlength: 50,
    required: [true, 'A User must have a company'],
  },
  address: {
    type: String,
    maxlength: 100,
  },
  phone: {
    type: Number,
    maxlength: 11,
  },
  password: {
    type: String,
    minlength: 8,
    maxlength: 100,
    required: [true, 'A user must have a password'],
    select: false,
  },
  refreshJWT: {
    token: {
      type: String,
      default: '',
    },
    addedAt: {
      type: Date,
      required: true,
      default: Date.now(),
    },
  },
  resetPin: {
    type: String,
    maxlength: 6,
    minlength: 6,
  },
  resetPinExp: Date,
});

UserSchema.pre('save', async function (req, res, next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
