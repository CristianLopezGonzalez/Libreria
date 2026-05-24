import express from 'express';
import { UserController } from '../controllers/UserController';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { Role } from '../generated/prisma/enums';

const router = express.Router();
const userC = new UserController();
const authM = new AuthMiddleware();

router.get('/:id', authM.authenticate, userC.getUserById);
router.get('/',authM.authenticate, authM.permitRoles([Role.ADMIN]), userC.getAllUsers);
router.put('/:id',authM.authenticate, userC.updateUser);
router.delete('/:id', userC.deleteUser);

export default router;