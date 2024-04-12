module.exports = {
  async up(knex) {
    const newTableName = 'articles_authors_links';
    await knex.schema.createTable(newTableName, function (table) {
      table.increments('id').primary();
      table.integer('article_id').unsigned().references('id').inTable('articles');
      table.integer('author_id').unsigned().references('id').inTable('authors');
      table.float('article_order').defaultTo(1.0);
      table.float('author_order').defaultTo(1.0);
    });
    const rows = await knex('articles_authors_bio_links').select('*');
    let manyToManyData = rows.map(row => {
      return {
        article_id: row.article_id,
        author_id: row.author_id,
        article_order: row.article_order
      };
    });
    return await knex(newTableName).insert(manyToManyData);
  }
};
