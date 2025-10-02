import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // This migration is for users who might have existing data with username
  // Since we're starting fresh with email-based auth, this migration ensures
  // the database schema is correct for email-based authentication
  
  // Check if users table exists and has username column
  const hasUsersTable = await knex.schema.hasTable('users');
  if (hasUsersTable) {
    const hasUsernameColumn = await knex.schema.hasColumn('users', 'username');
    const hasEmailColumn = await knex.schema.hasColumn('users', 'email');
    
    // If we have username but no email, we need to migrate
    if (hasUsernameColumn && !hasEmailColumn) {
      // Add email column
      await knex.schema.alterTable('users', (table) => {
        table.string('email', 255).unique();
      });
      
      // Migrate existing usernames to emails (assuming they are emails)
      await knex('users').update({
        email: knex.raw('username')
      });
      
      // Make email not nullable and remove username
      await knex.schema.alterTable('users', (table) => {
        table.string('email', 255).notNullable().alter();
        table.dropColumn('username');
      });
    }
  }
}

export async function down(knex: Knex): Promise<void> {
  // Reverse migration - convert email back to username
  const hasUsersTable = await knex.schema.hasTable('users');
  if (hasUsersTable) {
    const hasEmailColumn = await knex.schema.hasColumn('users', 'email');
    const hasUsernameColumn = await knex.schema.hasColumn('users', 'username');
    
    if (hasEmailColumn && !hasUsernameColumn) {
      // Add username column
      await knex.schema.alterTable('users', (table) => {
        table.string('username', 50).unique();
      });
      
      // Migrate emails to usernames
      await knex('users').update({
        username: knex.raw('email')
      });
      
      // Make username not nullable and remove email
      await knex.schema.alterTable('users', (table) => {
        table.string('username', 50).notNullable().alter();
        table.dropColumn('email');
      });
    }
  }
}
