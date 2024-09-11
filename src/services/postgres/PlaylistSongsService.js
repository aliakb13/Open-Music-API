/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const { convertGetSongs } = require('../../utils');
// const NotFoundError = require('../exceptions/NotFoundError');

class PlaylistSongsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addSongToPlaylist(playlistId, songId) {
    const id = `ps-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3)',
      values: [id, playlistId, songId],
    };

    await this._pool.query(query);

    await this._cacheService.delete(`playlistSongs:${playlistId}`);
  }

  async getSongsFromPlaylist(playlistId) {
    try {
      const result = await this._cacheService.get(`playlistSongs:${playlistId}`);
      const parsedData = JSON.parse(result);
      return {
        isCache: true,
        data: parsedData,
      };
    } catch (error) {
      const query = {
        text: `SELECT
        playlists.id AS playlist_id,
        playlists.name AS playlist_name,
        users.username AS username,
        songs.id AS id, songs.title AS title, songs.performer
        FROM playlists 
        JOIN users ON playlists.owner = users.id
        JOIN playlist_songs ON playlists.id = playlist_songs.playlist_id
        JOIN songs ON playlist_songs.song_id = songs.id
        WHERE playlists.id = $1`,
        values: [playlistId],
      };

      const result = await this._pool.query(query);

      const playlist = {
        id: result.rows[0].playlist_id,
        name: result.rows[0].playlist_name,
        username: result.rows[0].username,
        songs: result.rows.map(convertGetSongs),
      };

      await this._cacheService.set(`playlistSongs:${playlistId}`, JSON.stringify(playlist));

      return {
        isCache: false,
        data: playlist,
      };
    }
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2',
      values: [playlistId, songId],
    };

    await this._pool.query(query);

    await this._cacheService.delete(`playlistSongs:${playlistId}`);
  }
}

module.exports = PlaylistSongsService;
