import {BookController} from '../controllers/BookController';
import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { validateBody, validateParams, validateQuery } from '../middlewares/ValidateSchema';
import { bookIdParamsSchema, bookListQuerySchema, createBookSchema, updateBookSchema } from '../schemas/BookSchemas';

const router = Router();
const bookC = new BookController();
const authM = new AuthMiddleware();

router.get('/', authM.authenticate, validateQuery(bookListQuerySchema), bookC.getAllBooks);
router.get('/:id', authM.authenticate, validateParams(bookIdParamsSchema), bookC.getBookById);
router.post('/', authM.authenticate, validateBody(createBookSchema), bookC.createBook);
router.put('/:id', authM.authenticate, validateParams(bookIdParamsSchema), validateBody(updateBookSchema), bookC.updateBook);
router.delete('/:id', authM.authenticate, validateParams(bookIdParamsSchema), bookC.deleteBook);

export default router;