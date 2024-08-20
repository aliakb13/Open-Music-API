require('dotenv').config();
const Hapi = require('@hapi/hapi');
const ClientError = require('./exceptions/ClientError');
const albumPlugin = require('./api/albums');
const AlbumService = require('./services/AlbumService');
const albumValidator = require('./validator/albums');
const songPlugin = require('./api/songs');
const SongService = require('./services/SongService');
const songValidator = require('./validator/songs');

const init = async () => {
  const albumService = new AlbumService();
  const songservice = new SongService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    debug: {
      request: ['error'],
    },
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: albumPlugin,
      options: {
        service: albumService,
        validator: albumValidator,
      },
    },
    {
      plugin: songPlugin,
      options: {
        service: songservice,
        validator: songValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }
    return h.continue;
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
