import { User, IUser } from '../../models/User.js';
import { generateTokenPair, verifyRefreshToken } from '../../utils/jwt.js';
import { BadRequestError, UnauthorizedError, ConflictError } from '../../utils/AppError.js';
import type { RegisterInput, LoginInput } from './auth.schema.js';

export class AuthService {
  async register(input: RegisterInput) {
    const { username, email, password } = input;

    // Check existing
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      if (existing.email === email) throw new ConflictError('Email already registered');
      throw new ConflictError('Username already taken');
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      profile: { displayName: username },
    });

    // Generate tokens
    const tokens = generateTokenPair({ userId: user._id.toString(), role: user.role });

    return { user: this.sanitizeUser(user), ...tokens };
  }

  async login(input: LoginInput) {
    const { email, password } = input;

    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    if (!user) throw new UnauthorizedError('Invalid email or password');

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new UnauthorizedError('Invalid email or password');

    // Generate tokens
    const tokens = generateTokenPair({ userId: user._id.toString(), role: user.role });

    return { user: this.sanitizeUser(user), ...tokens };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = verifyRefreshToken(refreshToken);
      const user = await User.findById(payload.userId);
      if (!user) throw new UnauthorizedError('User not found');

      const tokens = generateTokenPair({ userId: user._id.toString(), role: user.role });
      return tokens;
    } catch {
      throw new UnauthorizedError('Invalid refresh token');
    }
  }

  async getMe(userId: string) {
    const user = await User.findById(userId);
    if (!user) throw new BadRequestError('User not found');
    return this.sanitizeUser(user);
  }

  private sanitizeUser(user: IUser) {
    const obj = user.toObject();
    delete (obj as any).password;
    return obj;
  }
}

export const authService = new AuthService();
