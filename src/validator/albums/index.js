const AlbumValidateSchema = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const AlbumValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = AlbumValidateSchema.validate(payload);

    if (validationResult.error) {
      // console.log('Kena di validasi joi', validationResult.error.message);
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AlbumValidator;
