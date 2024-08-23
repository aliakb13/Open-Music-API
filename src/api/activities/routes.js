const routes = (handler) => [
  {
    method: 'GET',
    path: '/playlists/{id}/activities',
    handler: handler.getActivities,
    options: {
      auth: 'playlistsapp_jwt',
    },
  },
];

module.exports = routes;
