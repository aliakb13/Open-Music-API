const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistPlugin',
  version: '1.0.0',
  register: async (server, options) => {
    const { playlistsService, validator } = options;
    const playlistsHandler = new PlaylistsHandler(playlistsService, validator);
    server.route(routes(playlistsHandler));
  },
};
