// name is related to module name plugins::users-permissions.user
module.exports = {
  applyUsersPermissionsUserLifecycles (strapi) {
    strapi.db.lifecycles.subscribe({
      models: ['plugin::users-permissions.user'],
      async afterCreate ({ result }) {
        await strapi.entityService.create('api::author.author', {
          data: {
            user: result.id,
            name: result.username,
          }
        });
      },
    });
  }
}
