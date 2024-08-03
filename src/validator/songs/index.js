const InvariantError = require('../../exceptions/InvariantError');
const songValidateSchema = require('./schema');

const SongValidator = {
  validateSongPayload: (payload) => {
    const validationResult = songValidateSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = SongValidator;
