import jwt from 'jsonwebtoken';
import { db } from '../config/database';
import { User, SendOTPRequest, SendOTPResponse, VerifyOTPRequest, VerifyOTPResponse, SignUpRequest, UserProfile, UpdateProfileRequest } from '../types';

export class AuthService {
  async sendOTP(request: SendOTPRequest): Promise<SendOTPResponse> {
    const { email } = request;
    
    // For now, hardcode OTP to 1234
    const otpCode = '1234';
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    
    // Clean up any existing OTPs for this email
    await db('otp_verifications')
      .where('email', email)
      .del();
    
    // Store new OTP
    await db('otp_verifications').insert({
      email,
      otp_code: otpCode,
      expires_at: expiresAt,
    });
    
    // In a real app, you would send the OTP via email/SMS here
    console.log(`OTP for ${email}: ${otpCode}`);
    
    return {
      message: 'OTP sent successfully',
      expires_in: 600, // 10 minutes in seconds
    };
  }

  async verifyOTP(request: VerifyOTPRequest): Promise<VerifyOTPResponse> {
    const { email, otp } = request;
    
    // Find valid OTP
    const otpRecord = await db('otp_verifications')
      .where('email', email)
      .where('otp_code', otp)
      .where('is_verified', false)
      .where('expires_at', '>', new Date())
      .first();
    
    if (!otpRecord) {
      throw new Error('Invalid or expired OTP');
    }
    
    // Mark OTP as verified
    await db('otp_verifications')
      .where('id', otpRecord.id)
      .update({ is_verified: true });
    
    // Find or create user
    let user = await db('users').where('email', email).first();
    
    if (!user) {
      // Create new user
      const [newUser] = await db('users').insert({
        email,
        role: 'user',
      }).returning('*');
      user = newUser;
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      },
    };
  }

  async getUserById(id: number): Promise<User | null> {
    return await db('users').where('id', id).first();
  }

  async createUser(email: string, role: 'user' | 'admin' = 'user'): Promise<User> {
    const [user] = await db('users').insert({
      email,
      role,
    }).returning('*');

    return user;
  }

  async getUserProfile(userId: number): Promise<UserProfile | null> {
    const user = await db('users')
      .select('id', 'email', 'first_name', 'last_name', 'phone', 'bio', 'avatar_url', 'company', 'job_title', 'location', 'website', 'role', 'created_at', 'updated_at')
      .where('id', userId)
      .first();

    return user || null;
  }

  async updateUserProfile(userId: number, profileData: UpdateProfileRequest): Promise<UserProfile> {
    const [updatedUser] = await db('users')
      .where('id', userId)
      .update({
        ...profileData,
        updated_at: new Date(),
      })
      .returning('*');

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      phone: updatedUser.phone,
      bio: updatedUser.bio,
      avatar_url: updatedUser.avatar_url,
      company: updatedUser.company,
      job_title: updatedUser.job_title,
      location: updatedUser.location,
      website: updatedUser.website,
      role: updatedUser.role,
      created_at: updatedUser.created_at,
      updated_at: updatedUser.updated_at,
    };
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
