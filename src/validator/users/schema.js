const Joi = require('joi');

const UserValidateSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  fullname: Joi.string().required(),
});

module.exports = UserValidateSchema;
