const autoBind = require('auto-bind');

/* eslint-disable no-underscore-dangle */
class PlaylistSongsHandler {
  constructor(
    playlistSongsService,
    playlistsService,
    songsService,
    playlistSongActivitiesService,
    validator,
  ) {
    this._playlistSongsService = playlistSongsService;
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._playlistSongActivitiesService = playlistSongActivitiesService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistSongHandler(request, h) {
    this._validator.validatePostPlaylistSongsPayload(request.payload);
    const { songId } = request.payload;
    const { id: playlistId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._songsService.checkSong(songId);
    await this._playlistsService.checkPlaylist(playlistId, userId);
    await this._playlistSongsService.addSongToPlaylist(playlistId, songId);
    // eslint-disable-next-line max-len
    await this._playlistSongActivitiesService.insertActivities(playlistId, songId, userId, 'add');

    const response = h.response({
      status: 'success',
      message: `Lagu dengan id ${songId} berhasil dimasukkan ke playlist ${playlistId}`,
    });
    response.code(201);
    return response;
  }

  async getPlaylistSongsHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { id: playlistId } = request.params;

    await this._playlistsService.checkPlaylist(playlistId, userId);
    const songsFromPlaylist = await this._playlistSongsService.getSongsFromPlaylist(playlistId);

    const response = h.response({
      status: 'success',
      data: {
        playlist: songsFromPlaylist,
      },
    });
    response.code(200);
    return response;
  }

  async deletePlaylistSongHandler(request, h) {
    this._validator.validateDeletePlaylistSongsPayload(request.payload);

    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: userId } = request.auth.credentials;

    await this._songsService.checkSong(songId);
    await this._playlistsService.checkPlaylist(playlistId, userId);
    await this._playlistSongsService.deleteSongFromPlaylist(playlistId, songId);
    // eslint-disable-next-line max-len
    await this._playlistSongActivitiesService.insertActivities(playlistId, songId, userId, 'delete');

    const response = h.response({
      status: 'success',
      message: `Lagu dengan id ${songId} berhasil dihapus dari playlist ${playlistId}`,
    });
    response.code(200);
    return response;
  }
}

module.exports = PlaylistSongsHandler;
