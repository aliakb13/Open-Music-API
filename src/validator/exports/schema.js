const Joi = require('joi');

const ExportsValidateSchema = Joi.object({
  targetEmail: Joi.string().required(),
});

module.exports = ExportsValidateSchema;
