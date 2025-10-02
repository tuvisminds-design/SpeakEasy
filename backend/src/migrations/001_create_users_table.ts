import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email', 255).unique().notNullable();
    table.string('first_name', 100);
    table.string('last_name', 100);
    table.string('phone', 20);
    table.text('bio');
    table.string('avatar_url', 500);
    table.string('company', 100);
    table.string('job_title', 100);
    table.string('location', 100);
    table.string('website', 255);
    table.enum('role', ['user', 'admin']).defaultTo('user');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}
