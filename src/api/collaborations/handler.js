const autoBind = require('auto-bind');

/* eslint-disable no-underscore-dangle */
class CollaborationsHandler {
  constructor(collaborationsService, playlistsService, usersService, validator) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._usersService = usersService;
    this._validator = validator;

    autoBind(this);
  }

  async postCollaborationHandler(request, h) {
    this._validator.validatePostCollaborationsPayload(request.payload);
    const { playlistId, userId: collabUserId } = request.payload;
    const { id: ownerId } = request.auth.credentials;

    await this._usersService.checkUserById(collabUserId);
    await this._playlistsService.checkPlaylist(playlistId, ownerId);
    const collabId = await this._collaborationsService.addCollaborations(playlistId, collabUserId);

    const response = h.response({
      status: 'success',
      data: {
        collaborationId: collabId,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCollaborationHandler(request, h) {
    this._validator.validateDeleteCollaborationsPayload(request.payload);
    const { playlistId, userId: collabUserId } = request.payload;
    const { id: ownerId } = request.auth.credentials;

    await this._usersService.checkUserById(collabUserId);
    await this._playlistsService.checkPlaylist(playlistId, ownerId);
    await this._collaborationsService.deleteCollaborations(playlistId, collabUserId);

    const response = h.response({
      status: 'success',
      message: `collab dengan userid-${collabUserId} telah dihapus`,
    });
    response.code(200);
    return response;
  }
}

module.exports = CollaborationsHandler;
