const AlbumLikesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albumLikesPlugin',
  version: '1.0.0',
  register: async (server, { service, albumService }) => {
    const albumLikesHandler = new AlbumLikesHandler(service, albumService);
    server.route(routes(albumLikesHandler));
  },
};
