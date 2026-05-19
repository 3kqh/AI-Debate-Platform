import { Router, Request, Response } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';
import { User } from '../../models/User.js';
import { NotFoundError } from '../../utils/AppError.js';
import type { AuthRequest } from '../../types/index.js';

const router = Router();

// GET /api/v1/users/:id — Public profile
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id);
    if (!user) throw new NotFoundError('User not found');
    sendSuccess(res, user);
  }),
);

// GET /api/v1/users/:id/stats — User stats
router.get(
  '/:id/stats',
  asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id).select('stats ranking username profile');
    if (!user) throw new NotFoundError('User not found');
    sendSuccess(res, user);
  }),
);

// PUT /api/v1/users/:id/profile — Update profile (authenticated, own profile)
router.put(
  '/:id/profile',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    if (req.user!.userId !== id) {
      return res.status(403).json({ success: false, message: 'Cannot edit other user profile' });
    }

    const { displayName, bio, avatar, school, club } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          'profile.displayName': displayName,
          'profile.bio': bio,
          'profile.avatar': avatar,
          'profile.school': school,
          'profile.club': club,
        },
      },
      { new: true, runValidators: true },
    );

    if (!user) throw new NotFoundError('User not found');
    sendSuccess(res, user, 'Profile updated');
  }),
);

export default router;
