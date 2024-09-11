/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class AlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addLikesToAlbum(userId, albumId) {
    const id = `likes-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    await this._cacheService.delete(`albumLikes:${albumId}`);
    await this._pool.query(query);
  }

  async cancelLikesToAlbum(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    await this._cacheService.delete(`albumLikes:${albumId}`);

    await this._pool.query(query);
  }

  async getAlbumLike(albumId) {
    try {
      const result = await this._cacheService.get(`albumLikes:${albumId}`);
      const parsedResult = Number(result);
      return {
        isCache: true,
        result: parsedResult,
      };
    } catch (error) {
      const query = {
        text: 'SELECT COUNT(album_id) FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };
      const result = await this._pool.query(query);

      const likes = result.rows[0].count;

      await this._cacheService.set(`albumLikes:${albumId}`, likes);
      return {
        isCache: false,
        result: Number(likes),
      };
    }
  }

  async checkLikeAlbum(userId, albumId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount) {
      throw new InvariantError('Gagal memberikan like pada album yang sama');
    }
  }

  async checkUnlikeAlbum(userId, albumId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Gagal membatalkan like, user belum memberikan like');
    }
  }
}

module.exports = AlbumLikesService;
