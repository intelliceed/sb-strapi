
module.exports = {
  async up(knex) {
    // You have full access to the Knex.js API with an already initialized connection to the database

    // Example: renaming a table
    // await knex.schema.renameTable('oldName', 'newName');

    // Example: renaming a column
    // await knex.schema.table('someTable', table => {
    //   table.renameColumn('oldName', 'newName');
    // });

    // Example: updating data
    await knex.from('pages').update({ short_name: 'A' }).where({ short_name: 'Home Page' });
  },
  async down(knex) {
    await knex.from('pages').update({ short_name: 'Home Page' }).where({ short_name: 'A' });
  }
};
