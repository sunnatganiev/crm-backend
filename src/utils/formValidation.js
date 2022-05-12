const Joi = require('joi');
const AppError = require('./appError');

const catchAsync = require('./catchAsync');

const email = Joi.string().email({
  minDomainSegments: 2,
  tlds: { allow: ['com', 'net'] },
});

const resetPin = Joi.string().min(6).max(6);

const newPassword = Joi.string().alphanum().min(3).max(30).required();

exports.forgotPassReqValidation = catchAsync(async (req, res, next) => {
  const schema = Joi.object({ email });

  const value = schema.validate(req.body.email);

  if (value.error)
    return next(
      new AppError(
        `${req.body.email} is not a valid email format. Please provide valid email`,
        403
      )
    );

  next();
});

exports.resetPassReqValidation = catchAsync(async (req, res, next) => {
  const schema = Joi.object({ email, resetPin, newPassword });

  const value = schema.validate(req.body);

  if (value.error) {
    console.log(value.error);
    return next(new AppError(`Please provide valid info`, 403));
  }

  next();
});
