# Analisis de la API

## Resumen
Esta API usa Express + Prisma (SQLite) con separacion controller/service y respuestas consistentes via ResponseHttp. Hay varios fallos funcionales en autenticacion/autorizacion, validacion limitada y manejo de errores generico. El refresh token se genera pero no se valida ni existe endpoint para renovacion. La configuracion de BD no usa el DATABASE_URL del entorno.

## Mapa de endpoints
| Metodo | Ruta | Protegida | Controlador |
| --- | --- | --- | --- |
| POST | /api/auth/login | No | AuthController.login |
| POST | /api/auth/register | No | AuthController.register |
| POST | /api/auth/logout | Si (pero no se aplica) | AuthController.logout |
| GET | /api/auth/profile | Si (Role USER/ADMIN) | AuthController.getProfile |
| GET | /api/books | No | BookController.getAllBooks |
| GET | /api/books/:id | No | BookController.getBookById |
| POST | /api/books | Si (Role ADMIN) | BookController.createBook |
| PUT | /api/books/:id | Si (Role ADMIN) | BookController.updateBook |
| DELETE | /api/books/:id | Si (Role ADMIN) | BookController.deleteBook |
| GET | /api/authors | No | AuthorController.getAllAuthors |
| GET | /api/authors/:id | No | AuthorController.getAuthorById |
| POST | /api/authors | Si (Role ADMIN) | AuthorController.createAuthor |
| GET | /api/categories | No | CategoryController.getAllCategories |
| GET | /api/categories/:id | No | CategoryController.getCategoryById |
| POST | /api/categories | Si (Role ADMIN) | CategoryController.createCategory |
| GET | /api/editorials | No | EditorialController.getAllEditorials |
| GET | /api/editorials/:id | No | EditorialController.getEditorialById |
| POST | /api/editorials | Si (Role ADMIN) | EditorialController.createEditorial |

Notas:
- UserRoutes.ts y UserController.ts estan vacios.
- Las rutas protegidas usan permitRoles sin authenticate, por lo que siempre responden 401.

## Autenticacion y autorizacion
- JWT expira en 3h y refresh token en 7d.
- AuthMiddleware.authenticate valida el Bearer token y carga req.user.
- AuthMiddleware.permitRoles valida el rol pero no autentica por si mismo.
- Refresh token se crea y se guarda en DB, pero no se verifica ni existe endpoint de refresh.
- Payload del token es inconsistente: en registro incluye email; en login no.
- Logout requiere req.user, pero la ruta no aplica authenticate, por lo que nunca funciona.

## Validacion y reglas de negocio
- Solo hay validacion de paginacion en getAllBooks.
- No hay validacion de email, contrasena, ISBN o longitud de strings.
- createBook acepta userId, authorId, categoryId, editorialId sin validar existencia.
- createAuthor/Category/Editorial no validan nombre (vacio, longitud, duplicados).

## Manejo de errores y respuestas
- ResponseHttp estandariza respuestas, pero la mayoria de errores termina en 500.
- getById devuelve 200 aun cuando no existe el recurso (book/author/category/editorial).
- Prisma update/delete lanzan error si no existe el ID; no se traducen a 404.
- No existe middleware global de errores ni handler de 404.

## Modelo de datos y Prisma
- Prisma usa PrismaLibSql con url hardcoded file:./dev.db.
- config/env exige DATABASE_URL pero no se usa en prisma.ts.
- User no tiene createdAt/updatedAt.
- Author/Category/Editorial no tienen unique en name, permite duplicados.

## Fallos potenciales (prioridad)
**Critico**
- Rutas protegidas usan permitRoles sin authenticate: todas esas rutas responden 401 y son inutilizables.

**Alto**
- Registro hace doble hash de contrasena (AuthController + UserService), lo que impide login.
- Logout y profile no funcionan por falta de middleware de autenticacion.
- Refresh token no se valida ni existe endpoint para renovacion.

**Medio**
- createBook permite IDs inexistentes y provoca errores 500 en DB.
- Falta validacion de entradas (email, password, ISBN, name).
- CORS abierto (cors()) sin restricciones; sin rate limit ni helmet.
- Token payload inconsistente entre login y register.

**Bajo**
- Diferencia de limite de pageSize: controller permite 100, service limita a 50.
- createBook confia en userId enviado por el cliente (riesgo si se habilita rol USER).
- UserRoutes/UserController sin implementar.

## Recomendaciones priorizadas
1. Encadenar authM.authenticate antes de authM.permitRoles en rutas protegidas.
2. Corregir el registro: hashear solo una vez (o en controller o en service).
3. Agregar endpoint de refresh token y verificacion; usar cookie-parser si se lee cookie.
4. Validar inputs con un schema (zod/joi) y retornar 400 con mensajes claros.
5. Mapear errores Prisma a 404/409 y agregar middleware global de errores.
6. Usar DATABASE_URL en prisma.ts y unificar configuracion de entorno.
7. Restringir CORS, agregar helmet y rate limit.
8. Unificar el limite de pageSize y estandarizar respuestas cuando no hay recurso.
9. Completar UserRoutes/UserController o eliminarlos si no se usan.

## Pruebas recomendadas (minimas)
- Registro y login con credenciales validas e invalidas.
- Acceso a rutas protegidas con y sin token.
- CRUD de books con IDs inexistentes (esperar 404).
- Validacion de paginacion y limites de pageSize.
- Duplicados (email, nick, isbn, name) y manejo de errores.
