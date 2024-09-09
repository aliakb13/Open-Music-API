const routes = (handler) => ({
  method: 'POST',
  path: '/export/playlists/{playlistId}',
  handler: handler.postExportsPlaylist,
  options: {
    auth: 'playlistsapp_jwt',
  },
});

module.exports = routes;
