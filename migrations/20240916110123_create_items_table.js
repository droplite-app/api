exports.up = function (knex) {
  return knex.schema.createTable('entries', function (table) {
    table.increments('id').primary();
    table
      .integer('owner_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
    table
      .integer('bucket_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('buckets')
      .onDelete('SET NULL');
    table
      .integer('parent_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('items')
      .onDelete('CASCADE');
    table.string('name', 255).notNullable();
    table.enu('item_type', ['folder', 'file']).notNullable();
    table.string('path', 512).nullable();
    table.string('mime_type', 255).nullable();
    table.integer('size').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.integer('left').notNullable();
    table.integer('right').notNullable();
    table.integer('depth').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('items');
};
