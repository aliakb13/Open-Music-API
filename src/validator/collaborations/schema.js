const Joi = require('joi');

const collaborationsPostValidateSchema = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required(),
});

const collaborationsDeleteValidateSchema = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required(),
});

module.exports = {
  collaborationsPostValidateSchema,
  collaborationsDeleteValidateSchema,
};
