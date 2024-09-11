// eslint-disable-next-line import/no-extraneous-dependencies
const autoBind = require('auto-bind');

/* eslint-disable no-underscore-dangle */
class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);

    const albumId = await this._service.addAlbums(request.payload);
    const response = h.response({
      status: 'success',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;

    const album = await this._service.getSpecifiedAlbums(id);
    const response = h.response({
      status: 'success',
      data: {
        album,
      },
    });
    response.code(200);
    return response;
  }

  async putAlbumByIdHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;

    const albumId = await this._service.updateAlbums(id, request.payload);

    const response = h.response({
      status: 'success',
      message: `berhasil mengupdate album id (${albumId})`,
    });
    response.code(200);
    return response;
  }

  async deleteAlbumByIdHandler(request, h) {
    const { id } = request.params;
    const albumName = await this._service.deleteAlbums(id);

    const response = h.response({
      status: 'success',
      message: `${albumName} berhasil di delete dari album`,
    });
    response.code(200);
    return response;
  }
}

module.exports = AlbumsHandler;
