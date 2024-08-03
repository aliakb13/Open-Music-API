const SongsHandler = require('./handler');
const songRoutes = require('./routes');

module.exports = {
  name: 'songsPlugin',
  version: '1.0.0',
  register: async (server, options) => {
    const { service, validator } = options;
    const songHandler = new SongsHandler(service, validator);
    server.route(songRoutes(songHandler));
  },
};
