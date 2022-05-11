const jwt = require('jsonwebtoken');
const User = require('../model/userModel');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { createAccessJWT } = require('./authController');

exports.refreshToken = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;

  //TODO
  // 1. make sure the token is valid
  const decoded = jwt.verify(authorization, process.env.JWT_REFRESH_SECRET);
  if (!decoded.id) return next(new AppError('Forbidded', 403));

  // 2. check if the jwt is exist in database
  const currentUser = await User.findById(decoded.id);

  let tokenExp = currentUser.refreshJWT.addedAt;
  const dbRefreshToken = currentUser.refreshJWT.token;

  tokenExp = tokenExp.setDate(
    tokenExp.getDate() + +process.env.JWT_REFRESH_SECRET_EXP_DAY
  );

  const today = new Date();

  // 3. check if it is not expired
  if (dbRefreshToken !== authorization || tokenExp < today)
    return next(new AppError('Forbidden', 403));

  const accessJWT = await createAccessJWT({ id: currentUser._id });

  res.status(200).json({
    status: 'success',
    accessJWT,
  });
});
