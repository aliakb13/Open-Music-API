/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const InvariantError = require('../exceptions/InvariantError');

class AuthenticationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addToken(token) {
    await this._pool.query('INSERT INTO authentications VALUES($1)', [token]);
  }

  async verifyRefreshTokenDb(token) {
    const query = {
      text: 'SELECT * FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Refresh Token tidak valid');
    }
  }

  async deleteToken(token) {
    await this._pool.query('DELETE FROM authentications WHERE token = $1', [token]);
  }
}

module.exports = AuthenticationsService;
