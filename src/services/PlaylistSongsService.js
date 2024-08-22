/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
// const NotFoundError = require('../exceptions/NotFoundError');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSongToPlaylist(playlistId, songId) {
    const id = `ps-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3)',
      values: [id, playlistId, songId],
    };

    await this._pool.query(query);
  }

  async getSongsFromPlaylist(playlistId) {
    const query = {
      text: `SELECT
      playlists.id AS playlist_id,
      playlists.name AS playlist_name,
      users.username AS username,
      songs.id AS id, songs.title AS title, songs.performer
      FROM playlists 
      JOIN users ON playlists.owner = users.id
      JOIN playlist_songs ON playlists.playlist_id = playlist_songs.playlist_id
      JOIN songs ON playlist_songs.song_id = songs.id
      WHERE playlist.id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    // if (!result.rows.length) {
    //   throw new NotFoundError('Playlist tidak ditemukan');
    // }

    console.log(result);

    return result.rows;
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2',
      values: [playlistId, songId],
    };

    await this._pool.query(query);
  }
}

module.exports = PlaylistSongsService;
