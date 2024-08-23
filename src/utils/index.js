const convertGetSongs = (song) => ({
  id: song.id,
  title: song.title,
  performer: song.performer,
});

const getActivities = (row) => ({
  username: row.username,
  title: row.title,
  action: row.action,
  time: row.time,
});
module.exports = { convertGetSongs, getActivities };
