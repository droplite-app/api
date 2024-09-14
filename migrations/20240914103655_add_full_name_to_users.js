exports.up = function (knex) {
  return knex.schema.alterTable('users', (table) => {
    table.string('full_name', 255);
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('users', (table) => {
    table.dropColumn('full_name');
  });
};
