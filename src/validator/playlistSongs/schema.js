const Joi = require('joi');

const PlaylistSongsPostSchema = Joi.object({
  songId: Joi.string().required(),
});

const PlaylistSongsDeleteSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = { PlaylistSongsPostSchema, PlaylistSongsDeleteSchema };
