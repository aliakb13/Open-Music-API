const autoBind = require('auto-bind');

/* eslint-disable no-underscore-dangle */
class PlaylistsHandler {
  constructor(playlistsService, validator) {
    this._playlistsService = playlistsService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);
    const { name: playlistName } = request.payload;
    const { id: userId } = request.auth.credentials;

    const playlistId = await this._playlistsService.addPlaylist(playlistName, userId);
    const response = h.response({
      status: 'success',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request, h) {
    const { id: userId } = request.auth.credentials;

    const { isCache, data: playlists } = await this._playlistsService.getPlaylists(userId);

    const response = h.response({
      status: 'success',
      data: {
        playlists,
      },
    });
    response.code(200);

    if (isCache) {
      response.header('X-Data-Source', 'cache');
    } else {
      response.header('X-Data-Source', 'not-cache');
    }
    return response;
  }

  async deletePlaylistHandler(request, h) {
    const { id: playlistId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._playlistsService.checkPlaylist(playlistId, userId);
    const playlistName = await this._playlistsService.deletePlaylist(playlistId, userId);

    const response = h.response({
      status: 'success',
      message: `playlist dengan nama: ${playlistName} berhasil dihapus`,
    });
    response.code(200);
    return response;
  }
}

module.exports = PlaylistsHandler;
