const routes = require('./routes');
const AuthenticationsHandler = require('./handler');

module.exports = {
  name: 'authPlugin',
  version: '1.0.0',
  register: async (server, options) => {
    const {
      authenticationsService,
      usersService,
      tokenManager,
      validator,
    } = options;
    const authenticationsHandler = new AuthenticationsHandler(
      authenticationsService,
      usersService,
      tokenManager,
      validator,
    );
    server.route(routes(authenticationsHandler));
  },
};
