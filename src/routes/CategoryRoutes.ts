import {CategoryController} from '../controllers/CategoryController';
import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { Role } from '../generated/prisma/enums';

const router = Router();
const categoryC = new CategoryController();
const authM = new AuthMiddleware();

router.get('/', categoryC.getAllCategories);
router.get('/:id', categoryC.getCategoryById);
router.post('/', authM.authenticate, authM.permitRoles([Role.ADMIN]), categoryC.createCategory);

export default router;