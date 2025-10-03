import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('response_feedback', (table) => {
    table.increments('id').primary();
    table.integer('conversation_id').unsigned().notNullable();
    table.string('user_email', 255).notNullable();
    table.integer('rating').unsigned().notNullable().checkBetween([1, 5]);
    table.text('correction_text').nullable(); // Optional textual feedback
    table.timestamps(true, true);
    
    table.foreign('conversation_id').references('id').inTable('conversations').onDelete('CASCADE');
    table.index(['conversation_id', 'user_email']);
    table.index(['user_email', 'created_at']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('response_feedback');
}
