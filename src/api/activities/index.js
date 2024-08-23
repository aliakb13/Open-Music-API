const PlaylistSongActivitiesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistSongActivitiesPlugin',
  version: '1.0.0',
  register: async (server, options) => {
    const { playlistSongActivitiesService, playlistsService } = options;
    const playlistSongActivitiesHandler = new PlaylistSongActivitiesHandler(
      playlistSongActivitiesService,
      playlistsService,
    );

    server.route(routes(playlistSongActivitiesHandler));
  },
};
