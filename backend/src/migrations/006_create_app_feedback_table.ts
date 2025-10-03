import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('app_feedback', (table) => {
    table.increments('id').primary();
    table.string('user_email', 255).notNullable();
    table.text('feedback_text').notNullable();
    table.integer('rating').unsigned().notNullable().checkBetween([1, 5]);
    table.string('feedback_type', 50).defaultTo('general'); // general, bug, feature, improvement
    table.timestamps(true, true);
    
    table.index(['user_email', 'created_at']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('app_feedback');
}
