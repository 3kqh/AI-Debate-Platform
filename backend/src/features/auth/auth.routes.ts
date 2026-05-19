import { Router } from 'express';
import { authController } from './auth.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { authLimiter } from '../../middleware/rateLimiter.js';
import { registerSchema, loginSchema, refreshTokenSchema } from './auth.schema.js';

const router = Router();

router.post(
  '/register',
  authLimiter,
  validate(registerSchema),
  asyncHandler(authController.register),
);

router.post(
  '/login',
  authLimiter,
  validate(loginSchema),
  asyncHandler(authController.login),
);

router.post(
  '/refresh-token',
  validate(refreshTokenSchema),
  asyncHandler(authController.refreshToken),
);

router.get(
  '/me',
  authenticate,
  asyncHandler(authController.getMe),
);

router.post(
  '/logout',
  authenticate,
  asyncHandler(authController.logout),
);

export default router;
