import { AuthController } from '../controllers/AuthController';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { validateBody } from '../middlewares/ValidateSchema';
import { 
    registerSchema, 
    loginSchema, 
} from '../schemas/AuthSchemas';
import express, { Router } from 'express';

const router: Router = express.Router();
const authC = new AuthController();
const authM = new AuthMiddleware();

router.post('/register', validateBody(registerSchema), authC.register);
router.post('/login', validateBody(loginSchema), authC.login);

router.post('/refresh-token', authC.refreshToken);
router.post('/logout', authM.authenticate, authC.logout);
router.get('/profile', authM.authenticate, authC.getProfile);

export default router;