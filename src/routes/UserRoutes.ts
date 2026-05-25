import { UserController } from '../controllers/UserController';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { Role } from '../generated/prisma/enums';
import express, { Router } from 'express';

const router: Router = express.Router();
const userC = new UserController();
const authM = new AuthMiddleware();

router.get('/:id', authM.authenticate, userC.getUserById);
router.get('/',authM.authenticate, authM.permitRoles([Role.ADMIN]), userC.getAllUsers);
router.put('/:id',authM.authenticate, userC.updateUser);
router.delete('/:id',authM.authenticate, userC.deleteUser);

export default router;