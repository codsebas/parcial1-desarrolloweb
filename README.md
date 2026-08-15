# Catálogo de Videos Educativos

Aplicación web multipágina para consultar un catálogo de videos educativos, con búsqueda, categorías, detalle, reproducción, registro, inicio de sesión y comentarios.

## Autor

- Albino Sebastián Rosales Ruano
- Carné: 1890-23-12105
- Curso: Desarrollo y Diseño Web

## Stack

- HTML5
- CSS3 puro
- JavaScript Vanilla
- ES Modules
- Fetch API
- sessionStorage

## Estructura

- `index.html`
- `pages/login.html`
- `pages/registro.html`
- `pages/video.html`
- `style/styles.css`
- `style/auth.css`
- `style/video.css`
- `script/config.js`
- `script/api.js`
- `script/session.js`
- `script/validators.js`
- `script/ui.js`
- `script/catalog.js`
- `script/login.js`
- `script/registro.js`
- `script/video.js`
- `script/script.js`
- `tests/*.test.js`
- `scripts/smoke-api.mjs`
- `docs/API.md`
- `docs/PRUEBAS.md`

## Rutas

- `/index.html`
- `/pages/login.html`
- `/pages/registro.html`
- `/pages/video.html?id={videoId}`

## Endpoints consumidos

- `GET /api/videos`
- `GET /api/videos/{id}`
- `GET /api/videos/categorias`
- `GET /api/videos/categoria/{nombreCategoria}`
- `POST /api/estudiantes/registrar`
- `POST /api/login`
- `POST /api/interaccionvideo/{videoId}/like`
- `POST /api/interaccionvideo/{videoId}/comentario`
- `POST /api/interaccionvideo/comentario/{comentarioId}/responder`
- `DELETE /api/interaccionvideo/comentario/{comentarioId}?carne={carne}`

## Ejecutar localmente

> IMPORTANTE: la app usa ES Modules y **no funciona** abriendo los archivos con doble clic (`file://`). Debes servirla por HTTP.

Opción con Python (desde la raíz del proyecto):

```bash
python -m http.server 5500
```

Luego abrir en el navegador:

```text
http://localhost:5500/
```

También puedes usar VS Code Live Server con la raíz del proyecto.

Si accidentalmente abres la app con `file://`, verás un aviso rojo en pantalla y el catálogo no cargará.

## Pruebas

```bash
npm test
npm run test:api
```

## Funcionalidades de visitante

- Ver catálogo.
- Buscar por título.
- Filtrar por categoría.
- Abrir detalle.
- Reproducir video.

## Funcionalidades autenticadas

- Dar me gusta.
- Quitar me gusta.
- Comentar.
- Responder comentarios principales.
- Eliminar comentarios propios.

## Validaciones

- Carné con formato `0000-00-00000`.
- Correo con estructura válida.
- PIN numérico.
- Usuario de login: carné o correo.

## Estado

Proyecto funcional en desarrollo con documentación y pruebas base incluidas.
