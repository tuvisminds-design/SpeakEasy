import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('ai_settings', (table) => {
    table.increments('id').primary();
    table.enum('provider', ['openai', 'claude', 'gemini']).unique().notNullable();
    table.boolean('is_active').defaultTo(false);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('ai_settings');
}
