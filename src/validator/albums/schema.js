const Joi = require('joi');

const AlbumValidateSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
});

module.exports = AlbumValidateSchema;
