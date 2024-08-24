const CollaborationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'collaborationPlugin',
  version: '1.0.0',
  register: async (server, options) => {
    const {
      collaborationsService,
      playlistsService,
      usersService,
      validator,
    } = options;
    const collaborationHandler = new CollaborationsHandler(
      collaborationsService,
      playlistsService,
      usersService,
      validator,
    );
    server.route(routes(collaborationHandler));
  },
};
