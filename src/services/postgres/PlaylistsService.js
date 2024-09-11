/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  constructor(collaborationsService, cacheService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService;
    this._cacheService = cacheService;
  }

  async addPlaylist(playlistName, owner) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistName, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal membuat playlist');
    }

    await this._cacheService.delete(`playlists:${owner}`);
    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    try {
      const result = await this._cacheService.get(`playlists:${owner}`);
      const parsedResult = JSON.parse(result);
      return {
        isCache: true,
        data: parsedResult,
      };
    } catch (error) {
      const query = {
        text: `SELECT playlists.id AS id,
        playlists.name,
        users.username
        FROM
        playlists
        LEFT JOIN
        users ON playlists.owner = users.id
        LEFT JOIN
        collaborations ON playlists.id = collaborations.playlist_id
        WHERE playlists.owner = $1 OR collaborations.user_id = $1`,
        values: [owner],
      };
      const result = await this._pool.query(query);
      const data = result.rows;

      await this._cacheService.set(`playlists:${owner}`, JSON.stringify(data));
      return {
        isCache: false,
        data,
      };
    }
  }

  async deletePlaylist(playlistId, owner) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 AND owner = $2 RETURNING name',
      values: [playlistId, owner],
    };

    const result = await this._pool.query(query);

    await this._cacheService.delete(`playlists:${owner}`);
    return result.rows[0].name;
  }

  async checkPlaylist(playlistId, owner) {
    const checkId = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(checkId);

    if (!result.rows.length) {
      throw new NotFoundError('playlist tidak ditemukan');
    }

    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyPlaylistSongsAccess(playlistId, userId) {
    try {
      await this.checkPlaylist(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      try {
        await this._collaborationsService.checkCollaborator(playlistId, userId);
      } catch {
        throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
      }
    }
  }
}

module.exports = PlaylistsService;
