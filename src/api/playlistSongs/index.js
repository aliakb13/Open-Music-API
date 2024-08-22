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
      validator,
    } = options;

    const playlistSongsHandler = new PlaylistSongsHandler(
      playlistSongsService,
      playlistsService,
      songService,
      validator,
    );
    server.route(routes(playlistSongsHandler));
  },
};
