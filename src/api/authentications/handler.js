const autoBind = require('auto-bind');

/* eslint-disable no-underscore-dangle */
class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    autoBind(this);
  }

  async postAuthenticationHandler(request, h) {
    this._validator.validateAuthPostPayload(request.payload);
    const { username, password } = request.payload;

    const id = await this._usersService.verifyUsernamePassword(username, password);

    const accessToken = this._tokenManager.generateAccessToken({ id });
    const refreshToken = this._tokenManager.generateRefreshToken({ id });

    await this._authenticationsService.addToken(refreshToken);

    const response = h.response({
      status: 'success',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }

  async putAuthenticationHandler(request, h) {
    this._validator.validateAuthPutPayload(request.payload);
    const { refreshToken } = request.payload;

    await this._authenticationsService.verifyRefreshTokenDb(refreshToken);
    const { id } = this._tokenManager.verifyRefreshToken(refreshToken);

    const accessToken = this._tokenManager.generateAccessToken({ id });

    const response = h.response({
      status: 'success',
      data: {
        accessToken,
      },
    });
    response.code(200);
    return response;
  }

  async deleteAuthenticationHandler(request, h) {
    this._validator.validateAuthDeletePayload(request.payload);

    const { refreshToken } = request.payload;

    await this._authenticationsService.verifyRefreshTokenDb(refreshToken);
    await this._authenticationsService.deleteToken(refreshToken);

    const response = h.response({
      status: 'success',
      message: 'Berhasil logout, refresh token dihapus',
    });
    response.code(200);
    return response;
  }
}

module.exports = AuthenticationsHandler;
