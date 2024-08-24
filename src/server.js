require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
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

// playlists
const playlistPlugin = require('./api/playlists');
const PlaylistsService = require('./services/PlaylistsService');
const PlaylistValidator = require('./validator/playlists');

// playlist_songs
const playlistSongsPlugin = require('./api/playlistSongs');
const PlaylistSongsService = require('./services/PlaylistSongsService');
const PlaylistSongsValidator = require('./validator/playlistSongs');

// playlist_song_activities
const playlistSongActivitiesPlugin = require('./api/activities');
const PlaylistSongActivitiesService = require('./services/PlaylistSongActivities');

// collaborations
const collaborationsPlugin = require('./api/collaborations');
const CollaborationsService = require('./services/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations');

const init = async () => {
  const albumService = new AlbumService();
  const songService = new SongService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const collaborationsService = new CollaborationsService();
  const playlistsService = new PlaylistsService(collaborationsService);
  const playlistSongsService = new PlaylistSongsService();
  const playlistSongActivitiesService = new PlaylistSongActivitiesService();

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

  server.register({
    plugin: Jwt,
  });

  // server.route({
  //   method: 'GET',
  //   path: '/',
  //   handler: () => 'Hello World!',
  //   options: {
  //     auth: 'playlistsapp_jwt',
  //   },
  // });

  server.auth.strategy('playlistsapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
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
        service: songService,
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
    {
      plugin: playlistPlugin,
      options: {
        playlistsService,
        validator: PlaylistValidator,
      },
    },
    {
      plugin: playlistSongsPlugin,
      options: {
        playlistSongsService,
        playlistsService,
        songService,
        playlistSongActivitiesService,
        validator: PlaylistSongsValidator,
      },
    },
    {
      plugin: playlistSongActivitiesPlugin,
      options: {
        playlistSongActivitiesService,
        playlistsService,
      },
    },
    {
      plugin: collaborationsPlugin,
      options: {
        collaborationsService,
        playlistsService,
        usersService,
        validator: CollaborationsValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      if (!response.isServer) {
        return h.continue;
      }

      const newResponse = h.response({
        status: 'error',
        message: response.message,
      });
      newResponse.code(500);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
