const express = require('express');
require('dotenv').config({ path: './config.env' });
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const userRouter = require('./src/routers/userRouter');
const ticketRouter = require('./src/routers/ticketRouter');
const globalErrorHandler = require('./src/utils/errorHandler');
const AppError = require('./src/utils/appError');

const app = express();

// API security
app.use(helmet());

// handle CORS error
app.use(cors());

// MongoDB Connection Setup
mongoose.connect(process.env.MONGO_URL).then(
  () => {
    if (process.env.NODE_ENV !== 'production')
      console.log('mongoose connected');
  },
  (err) => console.log(err)
);

// Logger
app.use(morgan('tiny'));

// Set body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routers

app.use('/v1/users', userRouter);
app.use('/v1/tickets', ticketRouter);

app.use((req, res, next) => {
  const err = new Error('Resources not found');
  err.status = 404;
  next(err);
});

app.use('*', (req, res, next) =>
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
);

app.use(globalErrorHandler);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`API is ready on http://localhost:${port}`);
});
