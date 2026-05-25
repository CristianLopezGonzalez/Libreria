import {AuthorController} from '../controllers/AuthorController';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { Role } from '../generated/prisma/enums';
import { validateBody } from '../middlewares/ValidateSchema';
import { nameSchema } from '../schemas/CommonSchemas';
import express, { Router } from 'express';

const router: Router = express.Router();
const authorC = new AuthorController();
const authM = new AuthMiddleware();

router.get('/', authorC.getAllAuthors);
router.get('/:id', authorC.getAuthorById);
router.post('/', authM.authenticate, authM.permitRoles([Role.ADMIN]), validateBody(nameSchema), authorC.createAuthor);

export default router;