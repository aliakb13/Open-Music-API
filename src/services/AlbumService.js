/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const NotFoundError = require('../exceptions/NotFoundError');
const InvariantError = require('../exceptions/InvariantError');

class AlbumService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbums({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }
    // console.log(typeof result.rows[0].id);
    return result.rows[0].id;
  }

  // async getAlbums() {
  //   const result = await this._pool.query('SELECT * FROM albums');
  //   return result.rows;
  // }

  async getSpecifiedAlbums(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal mendapatkan album. Album tidak ditemukan!');
    }

    return result.rows[0];
  }

  async updateAlbums(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Album tidak ditemukan!');
    }

    return result.rows[0].id;
  }

  async deleteAlbums(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING name',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus album. Album tidak ditemukan!');
    }
    return result.rows[0].name;
  }
}

module.exports = AlbumService;
