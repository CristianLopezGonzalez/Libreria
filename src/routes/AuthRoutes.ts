import {AuthController} from '../controllers/AuthController';
import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { Role } from '../generated/prisma/enums';

const router = Router();
const authC = new AuthController();
const authM = new AuthMiddleware();

router.post('/login', authC.login);
router.post('/register', authC.register);
router.post('/logout', authM.authenticate, authC.logout);
router.post('/refresh', authC.refreshToken);
router.get('/profile', authM.authenticate, authM.permitRoles([Role.USER, Role.ADMIN]), authC.getProfile);

export default router;