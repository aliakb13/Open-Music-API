const {
  AuthenticationPostSchema,
  AuthenticationPutSchema,
  AuthenticationDeleteSchema,
} = require('./schema');

const InvariantError = require('../../exceptions/InvariantError');

const AuthenticationValidator = {
  validateAuthPostPayload: (payload) => {
    const validationResult = AuthenticationPostSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateAuthPutPayload: (payload) => {
    const validationResult = AuthenticationPutSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateAuthDeletePayload: (payload) => {
    const validationResult = AuthenticationDeleteSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AuthenticationValidator;
