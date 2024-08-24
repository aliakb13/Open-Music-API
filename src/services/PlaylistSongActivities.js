/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../exceptions/InvariantError');
// const { getActivities } = require('../utils');

class PlaylistSongActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async insertActivities(playlistId, songId, userId, action) {
    const id = `activities-${nanoid(16)}`;
    const time = new Date().toISOString();

    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, time],
    };

    const result = await this._pool.query(query);

    // console.log(result.rows);

    if (!result.rows.length) {
      throw new InvariantError('Gagal melakukan insert activities');
    }
  }

  async getActivities(playlistId) {
    const query = {
      text: `SELECT playlist_song_activities.playlist_id, users.username, songs.id, songs.title, playlist_song_activities.action, playlist_song_activities.time
      FROM playlist_song_activities JOIN playlists ON playlist_song_activities.playlist_id = playlists.id
      JOIN users ON playlists.owner = users.id
      JOIN playlist_songs ON playlist_songs.playlist_id = playlists.id
      JOIN songs ON playlist_songs.song_id = songs.id
      WHERE playlist_song_activities.playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    console.log('from activity', result.rows);

    const activities = {
      playlistId: result.rows[0].playlist_id,
      activities: result.rows.map((row) => ({
        username: row.username,
        title: row.title,
        action: row.action,
        time: row.time,
      })),
    };

    // console.log(activities);

    return activities;
  }
}

module.exports = PlaylistSongActivitiesService;
