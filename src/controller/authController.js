const jwt = require('jsonwebtoken');

const User = require('../model/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const createAccessJWT = async (payload) => {
  const accessJWT = await jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });
  return accessJWT;
};

const createRefreshJWT = async (payload) => {
  const refreshJWT = await jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
  return refreshJWT;
};

exports.createUser = catchAsync(async (req, res, next) => {
  const result = await User.create(req.body);
  res.status(201).json({
    message: 'New user created',
    result,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password)
    return next(new AppError('Please provide email and password', 400));

  // get user with email from db
  const user = await User.findOne({ email }).select('+password');

  // hash our password and compare with the db one
  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError('Incorrect email or password', 401));

  const accessJWT = await createAccessJWT({ id: user._id });
  const refreshJWT = await createRefreshJWT({ id: user._id });

  res.status(201).json({
    status: 'success',
    accessJWT,
    refreshJWT,
    data: {
      user,
    },
  });
});
