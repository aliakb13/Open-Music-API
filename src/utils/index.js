const convertGetSongs = (song) => ({
  id: song.id,
  title: song.title,
  performer: song.performer,
});

// const convertGetSongsFromPlaylist = (obj) => ({
//   id: obj.playlist_id,
//   name: obj.playlist_name,
//   username: obj.playlist_username,
//   songs:
// });
module.exports = { convertGetSongs };
