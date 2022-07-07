const express = require('express');
require('express-async-errors');
app = express();
const cors = require('cors');
const blogsRouter = require('./controllers/blogs');
const config = require('./utils/config');
const logger = require('./utils/logger');
const mongoose = require('mongoose');
const {unknownEndpoint, errorHandler} = require('./utils/middleware');
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
app.use('/api/blogs', blogsRouter);
app.use(errorHandler);
app.use(unknownEndpoint);
module.exports = app;
