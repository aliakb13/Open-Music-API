/* eslint-disable no-underscore-dangle */
const autoBind = require('auto-bind');

class UsersHandler {
  constructor(usersService, validator) {
    this._usersService = usersService;
    this._validator = validator;

    autoBind(this);
  }

  async postUserHandler(request, h) {
    this._validator.validateUserPayload(request.payload);

    const userId = await this._usersService.addUser(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = UsersHandler;
