import {EditorialController} from '../controllers/EditorialController';
import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { Role } from '../generated/prisma/enums';

const router = Router();
const editorialC = new EditorialController();
const authM = new AuthMiddleware();

router.get('/', editorialC.getAllEditorials);
router.get('/:id', editorialC.getEditorialById);
router.post('/', authM.permitRoles([Role.ADMIN]), editorialC.createEditorial);

export default router;