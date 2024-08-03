/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
// const { getSongWithoutTime } = require('../utils');

class SongService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title, year, genre, performer, duration = null, albumId = null,
  }) {
    const id = `song-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId, createdAt, updatedAt],
    };
    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menambahkan lagu');
    }
    return result.rows[0].id;
  }

  async getSongs(title = null, performer = null) {
    let result;

    if (title && performer) {
      const query = {
        text: 'SELECT * FROM songs WHERE title ILIKE $1 AND performer ILIKE $2',
        values: [`%${title}%`, `%${performer}%`],
      };
      result = await this._pool.query(query);
      // console.log('title and performer was passed');
    }

    if (title && !performer) {
      result = await this._pool.query('SELECT * FROM songs WHERE title ILIKE $1', [`%${title}%`]);
      // console.log('title was passed, performer was null');
      // console.log(result);
    }

    if (!title && performer) {
      result = await this._pool.query('SELECT * FROM songs WHERE performer ILIKE $1', [`%${performer}%`]);
      // console.log('title was null, performer was passed');
    }

    if (!title && !performer) {
      result = await this._pool.query('SELECT * FROM songs');
      // console.log('title and performer was null');
    }
    // console.log(result);
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

    const song = result.rows[0];
    const newSong = {
      id: song.id,
      title: song.title,
      year: song.year,
      genre: song.genre,
      performer: song.performer,
      duration: song.duration,
      albumId: song.album_id,
    };
    return newSong;
  }

  async updateSong(id, payload) {
    const {
      title, year, genre, performer, duration = null, albumId = null,
    } = payload;

    const updatedAt = new Date().toISOString();

    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6, updated_at = $7 WHERE id = $8 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui lagu. Lagu tidak ditemukan!');
    }

    // console.log(result.rows);
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
