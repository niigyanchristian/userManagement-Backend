import express from 'express';
import { revokeMagicLink, sendMagicLink, verifyMagicLink } from '../controllers/MagicLinkController';
import { revokeMagicLinkValidator, sendMagicLinkValidator } from '../types/constants';
import { validateRequestBody } from '../middleware/validate';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = express.Router();
router.get('/verify/:token', revokeMagicLinkValidator, validateRequestBody, verifyMagicLink);
router.post('/send-magic-link', sendMagicLinkValidator, validateRequestBody, sendMagicLink);
router.post('/revoke', authenticateToken, authorizeRole(['Admin']), revokeMagicLinkValidator, revokeMagicLink);

export default router;
