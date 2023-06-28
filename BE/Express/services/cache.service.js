const expireCache = require('expire-cache');
const db = require('../database/connection');

const cacheService = {
  async setOneUser(userId) {
    const rolePermissions = await db
      .select('r.name AS role', 'p.name AS permission')
      .from('roles AS r')
      .join('users_roles AS ur', 'r.id', '=', 'ur.roleId')
      .leftJoin('roles_permissions AS rp', 'r.id', '=', 'rp.roleId')
      .leftJoin('permissions AS p', 'rp.permissionId', '=', 'p.id')
      .where('ur.userId', userId);

    const roles = Array.from(new Set(rolePermissions.map((item) => item.role)));
    const permissions = Array.from(
      new Set(rolePermissions.filter((item) => item.permission != null).map((item) => item.permission))
    );
    const userCache = expireCache.namespace('userCache');
    userCache(`${userId}`, { roles, permissions }, process.env.JWT_EXPIRE_TIME);
  },
  async getOneUser(userId) {
    const userCache = expireCache.namespace('userCache');
    if (!userCache) {
      return null;
    }

    return userCache(`${userId}`);
  },
  async getAllUser() {
    const userCache = expireCache.namespace('userCache');

    if (!userCache) {
      return null;
    }

    return userCache();
  },
};

Object.freeze(cacheService);

module.exports = {
  cacheService,
};