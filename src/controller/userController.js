const User = require('../model/userModel');

exports.createUser = async (req, res) => {
  try {
    const result = await User.create(req.body);
    res.status(201).json({
      message: 'New user created',
      result,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};
