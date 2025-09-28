import { Knex } from 'knex';
import bcrypt from 'bcryptjs';

export async function seed(knex: Knex): Promise<void> {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await knex('users').insert([
    {
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
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
