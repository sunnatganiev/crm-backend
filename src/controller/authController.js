const jwt = require('jsonwebtoken');

const User = require('../model/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { setJWT, getJWT, deleteJWT } = require('../utils/redis');

const createAccessJWT = async (payload) => {
  try {
    const accessJWT = await jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1m',
    });

    await setJWT(accessJWT, `${payload.id}`);
    return accessJWT;
  } catch (error) {
    return error;
  }
};

const storeUserRefreshJWT = async (_id, token) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id },
      { $set: { 'refreshJWT.token': token, 'refreshJWT.addedAt': Date.now() } },
      { new: true }
    );

    return updatedUser;
  } catch (error) {
    return error;
  }
};

const createRefreshJWT = async (payload) => {
  try {
    const refreshJWT = await jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '30d',
    });
    await storeUserRefreshJWT(payload.id, refreshJWT);
    return refreshJWT;
  } catch (error) {
    return error;
  }
};

const createUser = catchAsync(async (req, res, next) => {
  const result = await User.create(req.body);
  res.status(201).json({
    message: 'New user created',
    result,
  });
});

const login = catchAsync(async (req, res, next) => {
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
  });
});

const protect = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization)
    return next(
      new AppError('You are not logged in. Please login to get access', 401)
    );

  // 1. verifyif jwt is valid
  const decoded = jwt.verify(authorization, process.env.JWT_SECRET);

  // 2. check if jwt is exist in redis
  if (!decoded.id) {
    await deleteJWT(authorization);
    return next(new AppError('Forbidden', 403));
  }

  const userId = await getJWT(authorization);

  // 3) Check if user still exists
  const currentUser = await User.findById(userId);

  if (!currentUser) return next(new AppError('Forbidden', 403));

  // 4. GRANT ACCESS TO PROTECTED ROUTE

  req.user = currentUser;

  next();
});

module.exports = {
  protect,
  createRefreshJWT,
  createAccessJWT,
  login,
  createUser,
};
