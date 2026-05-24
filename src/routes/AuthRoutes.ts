import {AuthController} from '../controllers/AuthController';
import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { Role } from '../generated/prisma/enums';
import { validateBody } from '../middlewares/ValidateSchema';
import { loginSchema, registerSchema } from '../schemas/AuthSchemas';

const router = Router();
const authC = new AuthController();
const authM = new AuthMiddleware();

router.post('/login', validateBody(loginSchema), authC.login);
router.post('/register', validateBody(registerSchema), authC.register);
router.post('/logout', authM.authenticate, authC.logout);
router.post('/refresh', authC.refreshToken);
router.get('/profile', authM.authenticate, authM.permitRoles([Role.USER, Role.ADMIN]), authC.getProfile);

export default router;