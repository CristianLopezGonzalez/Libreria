import {BookController} from '../controllers/BookController';
import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { Role } from '../generated/prisma/enums';

const router = Router();
const bookC = new BookController();
const authM = new AuthMiddleware();

router.get('/', bookC.getAllBooks);
router.get('/:id', bookC.getBookById);
router.post('/', authM.permitRoles([Role.ADMIN]), bookC.createBook);
router.put('/:id', authM.permitRoles([Role.ADMIN]), bookC.updateBook);
router.delete('/:id', authM.permitRoles([Role.ADMIN]), bookC.deleteBook);

export default router;