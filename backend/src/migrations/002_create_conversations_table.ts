import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('conversations', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.string('topic', 255).notNullable();
    table.enum('speech_type', ['impromptu', 'planned']).notNullable();
    table.integer('duration').notNullable();
    table.enum('ai_provider', ['openai', 'claude', 'gemini']).notNullable();
    table.json('speaking_points').notNullable();
    table.timestamps(true, true);
    
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.index(['user_id', 'created_at']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('conversations');
}
