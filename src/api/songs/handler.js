/* eslint-disable no-underscore-dangle */
const autoBind = require('auto-bind');
const { convertGetSongs } = require('../../utils');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);

    const songId = await this._service.addSong(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  async getSongsHandler(request) {
    const { title, performer } = request.query;
    let songsQuery;

    if (title && performer) {
      songsQuery = await this._service.getSongs(title, performer);
      // console.log('title and performer was passed');
    }

    if (title && !performer) {
      songsQuery = await this._service.getSongs(title, null);
      // console.log('title was passed and performer was null');
    }

    if (!title && performer) {
      songsQuery = await this._service.getSongs(null, performer);
      // console.log('title was null and performer was passed');
    }

    if (!title && !performer) {
      songsQuery = await this._service.getSongs();
      // console.log('title and performer was null');
    }

    const mapSongs = songsQuery.map(convertGetSongs);
    return {
      status: 'success',
      data: {
        songs: mapSongs,
      },
    };
  }

  async getSongByIdHandler(request, h) {
    // this._validator.validateSongPayload(request.payload);
    const { id } = request.params;

    const song = await this._service.getSongById(id);
    const response = h.response({
      status: 'success',
      data: {
        song,
      },
    });
    response.code(200);
    return response;
  }

  async putSongByIdHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const { id } = request.params;

    const songId = await this._service.updateSong(id, request.payload);

    const response = h.response({
      status: 'success',
      message: `lagu dengan id:${songId} berhasil diupdate`,
    });
    response.code(200);
    return response;
  }

  async deleteSongByIdHandler(request, h) {
    const { id } = request.params;

    const songTitle = await this._service.deleteSong(id);

    const response = h.response({
      status: 'success',
      message: `lagu dengan title:${songTitle} berhasil dihapus`,
    });
    response.code(200);
    return response;
  }
}

module.exports = SongsHandler;
