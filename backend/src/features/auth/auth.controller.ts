import { Request, Response } from 'express';
import { authService } from './auth.service.js';
import { sendSuccess } from '../../utils/response.js';
import type { AuthRequest } from '../../types/index.js';

export class AuthController {
  async register(req: Request, res: Response) {
    const result = await authService.register(req.body);
    sendSuccess(res, result, 'Registration successful', 201);
  }

  async login(req: Request, res: Response) {
    const result = await authService.login(req.body);
    sendSuccess(res, result, 'Login successful');
  }

  async refreshToken(req: Request, res: Response) {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshToken(refreshToken);
    sendSuccess(res, tokens, 'Token refreshed');
  }

  async getMe(req: AuthRequest, res: Response) {
    const user = await authService.getMe(req.user!.userId);
    sendSuccess(res, user);
  }

  async logout(_req: Request, res: Response) {
    // Stateless JWT — client removes tokens
    sendSuccess(res, null, 'Logged out');
  }
}

export const authController = new AuthController();
