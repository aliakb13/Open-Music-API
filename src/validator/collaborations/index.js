const InvariantError = require('../../exceptions/InvariantError');
const {
  collaborationsPostValidateSchema,
  collaborationsDeleteValidateSchema,
} = require('./schema');

const CollaborationValidator = {
  validatePostCollaborationsPayload: (payload) => {
    const validationResult = collaborationsPostValidateSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateDeleteCollaborationsPayload: (payload) => {
    const validationResult = collaborationsDeleteValidateSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = CollaborationValidator;
