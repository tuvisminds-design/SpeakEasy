import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/database';
import { User, LoginRequest, LoginResponse } from '../types';

export class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const { username, password } = credentials;

    // Find user by username
    const user = await db('users').where('username', username).first();
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }

  async getUserById(id: number): Promise<User | null> {
    return await db('users').where('id', id).first();
  }

  async createUser(username: string, password: string, role: 'user' | 'admin' = 'user'): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [user] = await db('users').insert({
      username,
      password: hashedPassword,
      role,
    }).returning('*');

    return user;
  }

  async validateToken(token: string): Promise<User | null> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as { userId: number };
      return await this.getUserById(decoded.userId);
    } catch (error) {
      return null;
    }
  }
}
