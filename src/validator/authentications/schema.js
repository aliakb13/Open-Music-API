const Joi = require('joi');

const AuthenticationPostSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const AuthenticationPutSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const AuthenticationDeleteSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = {
  AuthenticationPostSchema,
  AuthenticationPutSchema,
  AuthenticationDeleteSchema,
};
