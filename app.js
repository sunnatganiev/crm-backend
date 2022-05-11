const express = require('express');
require('dotenv').config({ path: './config.env' });
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const userRoutes = require('./src/routers/userRoutes');
const ticketRoutes = require('./src/routers/ticketRoutes');
const tokenRoutes = require('./src/routers/tokenRoutes');
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

app.use('/v1/users', userRoutes);
app.use('/v1/tickets', ticketRoutes);
app.use('/v1/token', tokenRoutes);

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
