const express = require('express');
require('express-async-errors');
app = express();
const cors = require('cors');
const userRouter = require('./controllers/users');
const blogsRouter = require('./controllers/blogs');
const loginRouter = require('./controllers/login');
const config = require('./utils/config');
const logger = require('./utils/logger');
const mongoose = require('mongoose');
const {unknownEndpoint, errorHandler} = require('./utils/middleware');
const middleware = require('./utils/middleware');
mongoose.connect(config.MONGODB_URL,
    {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
      logger.info('connected to MongoDB');
    })
    .catch((error) => {
      logger.error('error connecting to MongoDB:', error.message);
    });
app.use(cors());
app.use(express.json());
app.use(middleware.tokenExtractor);
app.use('/api/login', loginRouter);
app.use('/api/users', userRouter);
app.use('/api/blogs', blogsRouter);
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing');
  app.use('/api/testing', testingRouter);
};
app.use(errorHandler);
app.use(unknownEndpoint);
module.exports = app;
