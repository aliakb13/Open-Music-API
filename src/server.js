require('dotenv').config();
const Hapi = require('@hapi/hapi');
const ClientError = require('./exceptions/ClientError');

// albums
const albumPlugin = require('./api/albums');
const AlbumService = require('./services/AlbumService');
const albumValidator = require('./validator/albums');

// songs
const songPlugin = require('./api/songs');
const SongService = require('./services/SongService');
const songValidator = require('./validator/songs');

// users
const userPlugin = require('./api/users');
const UsersService = require('./services/UsersService');
const userValidator = require('./validator/users');

// authentications
const authPlugin = require('./api/authentications');
const AuthenticationsService = require('./services/AuthenticationsService');
const authenticationValidator = require('./validator/authentications');
const TokenManager = require('./tokenize/TokenManager');

const init = async () => {
  const albumService = new AlbumService();
  const songservice = new SongService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    // debug: {
    //   request: ['error'],
    // },
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // server.route({
  //   method: 'GET',
  //   path: '/',
  //   handler: () => 'Hello World!',
  // });

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
    {
      plugin: userPlugin,
      options: {
        service: usersService,
        validator: userValidator,
      },
    },
    {
      plugin: authPlugin,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: authenticationValidator,
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
