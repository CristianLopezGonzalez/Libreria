import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { validateBody } from '../middlewares/ValidateSchema';
import { 
    registerSchema, 
    loginSchema, 
    verifyEmailSchema, 
    resendVerificationEmailSchema 
} from '../schemas/AuthSchemas';

const router = Router();
const authC = new AuthController();
const authM = new AuthMiddleware();

// Public endpoints
router.post('/register', validateBody(registerSchema), authC.register);
router.post('/login', validateBody(loginSchema), authC.login);
router.post('/verify-email', validateBody(verifyEmailSchema), authC.verifyEmail);
router.post('/resend-verification-email', validateBody(resendVerificationEmailSchema), authC.resendVerificationEmail);

// Protected endpoints
router.post('/refresh-token', authC.refreshToken);
router.post('/logout', authM.authenticate, authC.logout);
router.get('/profile', authM.authenticate, authC.getProfile);

export default router;