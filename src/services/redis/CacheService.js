/* eslint-disable no-underscore-dangle */
const redis = require('redis');
const NotFoundError = require('../../exceptions/NotFoundError');

class CacheService {
  constructor() {
    this._client = redis.createClient({
      socket: {
        host: process.env.REDIS_SERVER,
      },
    });

    this._client.on('error', (error) => {
      console.error('Redis client error:', error);
    });

    this._client.connect();
  }

  async set(key, value, durationInSecond = 1800) {
    await this._client.set(key, value, {
      EX: durationInSecond,
    });
  }

  async get(key) {
    const result = await this._client.get(key);

    if (result === null) throw new NotFoundError('Cache tidak ditemukan');
    return result;
  }

  async delete(key) {
    await this._client.del(key);
  }
}

module.exports = CacheService;
