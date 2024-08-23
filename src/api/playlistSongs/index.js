const PlaylistSongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistSongPlugin',
  version: '1.0.0',
  register: async (server, options) => {
    const {
      playlistSongsService,
      playlistsService,
      songService,
      playlistSongActivitiesService,
      validator,
    } = options;

    const playlistSongsHandler = new PlaylistSongsHandler(
      playlistSongsService,
      playlistsService,
      songService,
      playlistSongActivitiesService,
      validator,
    );
    server.route(routes(playlistSongsHandler));
  },
};
