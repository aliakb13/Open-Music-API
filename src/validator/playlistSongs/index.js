const InvariantError = require('../../exceptions/InvariantError');
const { PlaylistSongsPostSchema, PlaylistSongsDeleteSchema } = require('./schema');

const PlaylistSongsValidator = {
  validatePostPlaylistSongsPayload: (payload) => {
    const validationResult = PlaylistSongsPostSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateDeletePlaylistSongsPayload: (payload) => {
    const validationResult = PlaylistSongsDeleteSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistSongsValidator;
