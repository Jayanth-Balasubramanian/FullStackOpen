const logger = require('./logger');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'});
};
const errorHandler = (error, request, response, next) => {
  logger.error(error.message);
  if (error.name === 'CastError') {
    return response.status(400).send({error: 'malformed id'});
  }
  if (error.name === 'ValidationError') {
    return response.status(400).send({error: error.message});
  }
  if (error.name === 'JsonWebTokenError') {
    return response.status(401).send({error: 'invalid token'});
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired',
    });
  }
  next(error);
};


const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7);
  }
  next();
};

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  request.user = await User.findById(decodedToken.id);
  next();
};
module.exports = {unknownEndpoint, errorHandler, tokenExtractor, userExtractor};
