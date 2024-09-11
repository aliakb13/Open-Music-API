const autoBind = require('auto-bind');

/* eslint-disable no-underscore-dangle */
class AlbumLikesHandler {
  constructor(service, albumService) {
    this._service = service;
    this._albumService = albumService;

    autoBind(this);
  }

  async postLikesToAlbumHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { id: albumId } = request.params;

    await this._albumService.checkAlbum(albumId);

    await this._service.checkLikeAlbum(userId, albumId);

    await this._service.addLikesToAlbum(userId, albumId);

    const response = h.response({
      status: 'success',
      message: 'Berhasil memberikan like pada album',
    });
    response.code(201);
    return response;
  }

  async deleteLikesFromAlbumHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { id: albumId } = request.params;

    await this._albumService.checkAlbum(albumId);
    await this._service.checkUnlikeAlbum(userId, albumId);
    await this._service.cancelLikesToAlbum(userId, albumId);

    const response = h.response({
      status: 'success',
      message: 'berhasil menghapus like pada album',
    });
    response.code(200);
    return response;
  }

  async getLikesFromAlbumHandler(request, h) {
    const { id: albumId } = request.params;

    await this._albumService.checkAlbum(albumId);

    const { isCache, result: likes } = await this._service.getAlbumLike(albumId);

    const response = h.response({
      status: 'success',
      data: {
        likes,
      },
    });
    response.code(200);

    if (isCache) {
      response.header('X-Data-Source', 'cache');
    } else {
      response.header('X-Data-Source', 'not-cache');
    }
    return response;
  }
}

module.exports = AlbumLikesHandler;
