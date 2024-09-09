/* eslint-disable no-underscore-dangle */
const autoBind = require('auto-bind');

class UploadsHandler {
  constructor(service, albumService, validator) {
    this._service = service;
    this._albumService = albumService;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumCoverHandler(request, h) {
    const { cover: file } = request.payload;
    // console.log(file);

    this._validator.validateCoverHeaders(file.hapi.headers);

    const { id: albumId } = request.params;

    const filename = await this._service.writeFile(file, file.hapi);

    const url = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;

    await this._albumService.insertCoverAlbum(albumId, url);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;