import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('otp_verifications', (table) => {
    table.increments('id').primary();
    table.string('email', 255).notNullable();
    table.string('otp_code', 6).notNullable();
    table.boolean('is_verified').defaultTo(false);
    table.timestamp('expires_at').notNullable();
    table.timestamps(true, true);
    
    table.index(['email', 'otp_code']);
    table.index(['expires_at']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('otp_verifications');
}
