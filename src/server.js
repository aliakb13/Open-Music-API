require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const ClientError = require('./exceptions/ClientError');

// albums
const albumPlugin = require('./api/albums');
const AlbumService = require('./services/postgres/AlbumService');
const albumValidator = require('./validator/albums');

// songs
const songPlugin = require('./api/songs');
const SongService = require('./services/postgres/SongService');
const songValidator = require('./validator/songs');

// users
const userPlugin = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const userValidator = require('./validator/users');

// authentications
const authPlugin = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const authenticationValidator = require('./validator/authentications');
const TokenManager = require('./tokenize/TokenManager');

// playlists
const playlistPlugin = require('./api/playlists');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const PlaylistValidator = require('./validator/playlists');

// playlist_songs
const playlistSongsPlugin = require('./api/playlistSongs');
const PlaylistSongsService = require('./services/postgres/PlaylistSongsService');
const PlaylistSongsValidator = require('./validator/playlistSongs');

// playlist_song_activities
const playlistSongActivitiesPlugin = require('./api/activities');
const PlaylistSongActivitiesService = require('./services/postgres/PlaylistSongActivities');

// collaborations
const collaborationsPlugin = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations');

// exports
const exportsPlugin = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/exports');

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
    {
      plugin: exportsPlugin,
      options: {
        service: ProducerService,
        playlistsService,
        validator: ExportsValidator,
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
