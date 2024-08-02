const albumsRoutes = require('./routes');
const NotesHandler = require('./handler');

module.exports = {
  name: 'albumsPlugin',
  version: '1.0.0',
  register: async (server, options) => {
    const { service, validator } = options;
    const notesHandler = new NotesHandler(service, validator);
    server.route(albumsRoutes(notesHandler));
  },
};
