import {EditorialController} from '../controllers/EditorialController';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { Role } from '../generated/prisma/enums';
import { validateBody } from '../middlewares/ValidateSchema';
import { nameSchema } from '../schemas/CommonSchemas';
import express, { Router } from 'express';

const router: Router = express.Router();
const editorialC = new EditorialController();
const authM = new AuthMiddleware();

router.get('/', editorialC.getAllEditorials);
router.get('/:id', editorialC.getEditorialById);
router.post('/', authM.authenticate, authM.permitRoles([Role.ADMIN]), validateBody(nameSchema), editorialC.createEditorial);

export default router;