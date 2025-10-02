import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Create admin user
  await knex('users').insert([
    {
      email: 'kulkarni.madhwaraj@gmail.com',
      role: 'admin',
      first_name: 'Madhwaraj',
      last_name: 'Kulkarni',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);

  // Set default AI provider
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
