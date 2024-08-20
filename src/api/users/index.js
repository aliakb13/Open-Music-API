const UsersHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'userPlugin',
  version: '1.0.0',
  register: async (server, options) => {
    const { service, validator } = options;
    const usersHandler = new UsersHandler(service, validator);
    server.route(routes(usersHandler));
  },
};
