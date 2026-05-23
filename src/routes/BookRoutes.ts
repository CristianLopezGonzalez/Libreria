import {BookController} from '../controllers/BookController';
import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';

const router = Router();
const bookC = new BookController();
const authM = new AuthMiddleware();

router.get('/', authM.authenticate, bookC.getAllBooks);
router.get('/:id', authM.authenticate, bookC.getBookById);
router.post('/', authM.authenticate, bookC.createBook);
router.put('/:id', authM.authenticate, bookC.updateBook);
router.delete('/:id', authM.authenticate, bookC.deleteBook);

export default router;