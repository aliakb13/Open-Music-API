const autoBind = require('auto-bind');

/* eslint-disable no-underscore-dangle */
class PlaylistSongActivitiesHandler {
  constructor(playlistSongActivitiesService, playlistsService) {
    this._playlistSongActivitiesService = playlistSongActivitiesService;
    this._playlistsService = playlistsService;

    autoBind(this);
  }

  async getActivities(request, h) {
    const { id: playlistId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._playlistsService.checkPlaylist(playlistId, userId);
    const activities = await this._playlistSongActivitiesService.getActivities(playlistId);

    const response = h.response({
      status: 'success',
      data: activities,
    });
    response.code(200);
    return response;
  }
}

module.exports = PlaylistSongActivitiesHandler;
