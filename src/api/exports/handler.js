/* eslint-disable no-underscore-dangle */

const autoBind = require('auto-bind');

class ExportHandler {
  constructor(service, playlistsService, validator) {
    this._service = service;
    this._playlistsService = playlistsService;
    this._validator = validator;

    autoBind(this);
  }

  async postExportsPlaylist(request, h) {
    this._validator.validateExportsPayload(request.payload);

    const { playlistId } = request.params;
    const { id: userId } = request.auth.credentials;
    const { targetEmail } = request.payload;

    await this._playlistsService.checkPlaylist(playlistId, userId);

    const message = {
      playlistId,
      targetEmail,
    };

    await this._service.sendMessage('export:playlists', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportHandler;
