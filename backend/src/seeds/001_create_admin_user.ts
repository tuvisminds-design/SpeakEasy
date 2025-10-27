import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Create admin user (only if doesn't exist)
  const existingAdmin = await knex('users').where({ email: 'admin@speakeasy.com' }).first();
  
  if (!existingAdmin) {
    await knex('users').insert([
      {
        email: 'admin@speakeasy.com',
        role: 'admin',
        first_name: 'Admin',
        last_name: 'User',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  }

  // Set default AI provider (only if doesn't exist)
  const existingSettings = await knex('ai_settings').first();
  
  if (!existingSettings) {
    await knex('ai_settings').insert([
      {
        provider: 'openai',
        is_active: true,
      },
      {
        provider: 'claude',
        is_active: false,
      },
      {
        provider: 'gemini',
        is_active: false,
      },
    ]);
  }
}