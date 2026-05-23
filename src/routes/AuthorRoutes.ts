import {AuthorController} from '../controllers/AuthorController';
import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { Role } from '../generated/prisma/enums';

const router = Router();
const authorC = new AuthorController();
const authM = new AuthMiddleware();

router.get('/', authorC.getAllAuthors);
router.get('/:id', authorC.getAuthorById);
router.post('/', authM.permitRoles([Role.ADMIN]), authorC.createAuthor);

export default router;