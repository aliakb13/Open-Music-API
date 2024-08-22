const Joi = require('joi');

const PlaylistValidateSchema = Joi.object({
  name: Joi.string().required(),
});

module.exports = PlaylistValidateSchema;
