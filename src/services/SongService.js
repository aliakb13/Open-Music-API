/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

class SongService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title, year, genre, performer, duration = null, albumId = null,
  }) {
    const id = `song-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId],
    };
    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menambahkan lagu');
    }
    return result.rows[0].id;
  }

  async getSongs() {
    const result = await this._pool.query('SELECT * FROM songs');
    return result.rows;
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal mendapatkan Lagu. Lagu tidak ditemukan!');
    }
    // console.log(result);
    return result.rows[0];
  }

  async updateSong(id, payload) {
    const {
      title, year, genre, performer, duration = null, albumId = null,
    } = payload;

    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, albumId = $6 WHERE id = $7 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, id],
    };

    console.log('query: ', query);

    // const result = await this._pool.query('SELECT * FROM songs');

    // const result = await this._pool.query(query);
    let result;
    try {
      result = await this._pool.query(query);
    } catch (err) {
      console.error('Query failed:', err);
      throw new Error('Database query failed');
    }

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui lagu. Lagu tidak ditemukan!');
    }

    console.log(result.rows);
    return result.rows[0].id;
  }

  async deleteSong(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING title',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus lagu. Lagu tidak ditemukan!');
    }
    return result.rows[0].title;
  }
}

module.exports = SongService;
