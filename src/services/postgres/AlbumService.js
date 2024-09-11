/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');
const { convertGetSongs } = require('../../utils');

class AlbumService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbums({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, year, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getSpecifiedAlbums(id) {
    const albumsQuery = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };

    const songsQuery = {
      text: 'SELECT * FROM songs WHERE album_id = $1',
      values: [id],
    };

    const albumsResult = await this._pool.query(albumsQuery);
    const songsResult = await this._pool.query(songsQuery);

    if (!albumsResult.rows.length) {
      throw new NotFoundError('Gagal mendapatkan album. Album tidak ditemukan!');
    }

    const albums = albumsResult.rows[0];
    const songs = songsResult.rows;

    const combined = {
      id: albums.id,
      name: albums.name,
      year: albums.year,
      songs: songs.map(convertGetSongs),
      coverUrl: albums.cover,
    };

    return combined;
  }

  async updateAlbums(id, { name, year }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id],
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

  async checkAlbum(albumId) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }
  }

  async insertCoverAlbum(albumId, url) {
    const query = {
      text: 'UPDATE albums SET cover = $2 WHERE id = $1',
      values: [albumId, url],
    };

    await this._pool.query(query);
  }
}

module.exports = AlbumService;
