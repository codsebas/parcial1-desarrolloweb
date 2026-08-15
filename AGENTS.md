# AGENTS.md — Parcial 1 de Desarrollo y Diseño Web

## 1. Propósito de este archivo

Este archivo es el contrato de trabajo para cualquier agente de programación que participe en este repositorio, incluyendo OpenCode.

El objetivo es desarrollar el **Primer Parcial de Desarrollo y Diseño Web** como una aplicación web de catálogo de videos educativos que consuma una API REST existente.

El agente debe:

- Respetar estrictamente el stack definido.
- Trabajar sobre la estructura existente del repositorio sin destruir trabajo previo.
- Implementar cada funcionalidad en pasos pequeños y verificables.
- Ejecutar pruebas antes de considerar una tarea terminada.
- Crear commits pequeños, funcionales y con mensajes en español siguiendo la nomenclatura indicada en este documento.
- Mantener la documentación actualizada.
- No inventar contratos de API, campos de respuesta ni endpoints que no hayan sido observados.
- No realizar `push`, `force-push`, rebase destructivo ni cambios de historial salvo instrucción explícita del usuario.

---

# 2. Datos académicos del proyecto

- **Universidad:** Universidad Mariano Gálvez de Guatemala
- **Curso:** Desarrollo y Diseño Web
- **Evaluación:** Primer Parcial
- **Estudiante:** Albino Sebastián Rosales Ruano
- **Carné:** 1890-23-12105
- **Fecha del parcial:** 15/08/2026

Estos datos deben aparecer en el `README.md` final y pueden utilizarse en el pie de página de la aplicación.

---

# 3. Objetivo funcional

Construir una aplicación web para consultar un catálogo de videos educativos.

Un visitante debe poder:

- Consultar el catálogo completo.
- Buscar videos por título en tiempo real.
- Filtrar videos por categoría.
- Consultar el detalle de un video.
- Reproducir un video.

Un estudiante autenticado, además, debe poder:

- Dar Me gusta a un video.
- Quitar su Me gusta volviendo a presionar el control.
- Publicar comentarios principales.
- Responder comentarios principales.
- Eliminar únicamente sus propios comentarios.

El sistema debe permitir:

- Registro de estudiantes.
- Inicio de sesión mediante carné o correo electrónico.
- Persistencia de la sesión durante la pestaña actual mediante `sessionStorage`.
- Cierre de sesión.

---

# 4. Stack obligatorio

## Producción

Utilizar únicamente:

- HTML5.
- CSS3 puro.
- JavaScript Vanilla moderno.
- ES Modules.
- Fetch API.
- `sessionStorage`.
- API REST proporcionada por el catedrático.

## Herramientas permitidas

- Git.
- Node.js únicamente para ejecutar pruebas y scripts de verificación.
- `node:test` y `node:assert`, incluidos en Node.js, para pruebas automatizadas.
- VS Code Live Server o `python -m http.server` para servir el frontend localmente.

## Tecnologías prohibidas

No agregar:

- Bootstrap.
- Tailwind.
- React.
- Vue.
- Angular.
- Svelte.
- jQuery.
- TypeScript.
- Vite.
- Webpack.
- Parcel.
- Axios.
- SweetAlert.
- Librerías de componentes.
- Frameworks CSS.
- Frameworks de pruebas con dependencias externas.

El proyecto debe seguir siendo comprensible como un proyecto de **Desarrollo Web I**.

No agregar una dependencia únicamente para resolver algo que pueda hacerse razonablemente con HTML, CSS o JavaScript nativo.

---

# 5. URL base de la API

Centralizar la URL en un único archivo de configuración.

```text
https://backvideo-hpevgdenh7hygvfm.canadacentral-01.azurewebsites.net
```

Nunca repetir la URL base manualmente en múltiples archivos.

Crear:

```text
js/config.js
```

y exportar una constante:

```js
export const API_BASE_URL =
  "https://backvideo-hpevgdenh7hygvfm.canadacentral-01.azurewebsites.net";
```

---

# 6. Contrato de endpoints proporcionado

## 6.1 Registro de estudiante

```http
POST /api/estudiantes/registrar
```

Cuerpo:

```json
{
  "carne": "1890-20-11489",
  "estudiante": "JUAN PEREZ",
  "correo": "juan.perez@correo.com",
  "password": "1234"
}
```

Reglas:

- `carne` debe respetar estrictamente `0000-00-00000`.
- `correo` debe tener estructura válida.
- `password` representa un PIN estrictamente numérico.
- No se permiten carnés duplicados.
- No se permiten correos duplicados.
- La unicidad definitiva la valida el backend.

---

## 6.2 Inicio de sesión

```http
POST /api/login
```

Cuerpo:

```json
{
  "usuario": "1890-20-11489",
  "password": "1234"
}
```

`usuario` puede ser:

- Carné.
- Correo electrónico.

El frontend nunca debe guardar el PIN.

Antes de implementar la persistencia de sesión, verificar la respuesta real del endpoint y determinar dónde viene el carné del estudiante autenticado.

Las interacciones requieren `carne`. Si el login no devuelve el carné cuando el usuario inicia sesión por correo, no inventar el dato: documentar el comportamiento real y resolverlo únicamente con información real de la API.

---

## 6.3 Catálogo completo

```http
GET /api/videos
```

Objetivo:

- Obtener el catálogo completo.
- Utilizarlo para la carga inicial.
- Utilizarlo para búsqueda local por título.

---

## 6.4 Detalle de un video

```http
GET /api/videos/{id}
```

Objetivo:

- Obtener la información detallada del video seleccionado.
- Obtener la información de interacciones si la respuesta real del backend la incluye.
- Obtener comentarios si la respuesta real del backend los incluye.

No inventar un endpoint adicional para comentarios si no existe.

---

## 6.5 Categorías

```http
GET /api/videos/categorias
```

Objetivo:

- Construir dinámicamente el selector o conjunto de botones de categorías.
- No quemar categorías manualmente en HTML.

---

## 6.6 Videos por categoría

```http
GET /api/videos/categoria/{nombreCategoria}
```

Siempre utilizar:

```js
encodeURIComponent(nombreCategoria)
```

para construir el segmento dinámico.

---

## 6.7 Toggle de Me gusta

```http
POST /api/interaccionvideo/{videoId}/like
```

Cuerpo:

```json
{
  "carne": "1890-20-11489"
}
```

Regla de negocio:

- Un estudiante solo puede tener un Me gusta por video.
- El mismo endpoint funciona como toggle.
- Si no tenía Me gusta, lo agrega.
- Si ya tenía Me gusta, lo elimina.

No implementar un contador paralelo que pueda desincronizarse de la API.

Después de una mutación exitosa, actualizar el detalle del video o utilizar de forma segura la respuesta real del endpoint.

---

## 6.8 Publicar comentario principal

```http
POST /api/interaccionvideo/{videoId}/comentario
```

Cuerpo:

```json
{
  "carne": "1890-20-11489",
  "texto": "Excelente explicación del framework."
}
```

---

## 6.9 Responder comentario

```http
POST /api/interaccionvideo/comentario/{comentarioId}/responder
```

Cuerpo:

```json
{
  "carne": "1890-20-11489",
  "texto": "Totalmente de acuerdo con tu punto de vista."
}
```

Regla:

- Solo se permite un nivel de anidamiento.
- Los comentarios principales pueden recibir respuestas.
- Las respuestas NO deben ofrecer un botón para responder.

Estructura permitida:

```text
Comentario principal
├── Respuesta
├── Respuesta
└── Respuesta
```

Estructura prohibida:

```text
Comentario principal
└── Respuesta
    └── Respuesta
```

---

## 6.10 Eliminar comentario

```http
DELETE /api/interaccionvideo/comentario/{comentarioId}?carne={carne}
```

Ejemplo:

```text
/api/interaccionvideo/comentario/10?carne=1890-20-11489
```

Utilizar:

```js
encodeURIComponent(carne)
```

para el query parameter.

Reglas:

- Un estudiante solo puede eliminar sus propios comentarios.
- El frontend debe ocultar el botón Eliminar cuando el comentario no pertenezca al usuario actual.
- El backend sigue siendo la autoridad final.
- Si el backend responde `403 Forbidden`, mostrar un mensaje claro sin romper la aplicación.

---

# 7. Descubrimiento obligatorio del contrato real

Los endpoints anteriores provienen del enunciado del parcial, pero los nombres exactos de los campos de **respuesta** deben observarse en la API.

Antes de desarrollar componentes dependientes de datos:

1. Probar los endpoints GET.
2. Registrar la forma real del JSON.
3. Identificar:
   - ID del video.
   - Título.
   - Descripción.
   - Duración.
   - Categoría.
   - Póster.
   - URL o fuente del video.
   - Conteo de Me gusta, si existe.
   - Comentarios, si existen.
   - ID de comentario.
   - Autor/carné del comentario.
   - Respuestas.
4. Registrar el resultado en `docs/API.md`.
5. Implementar el frontend utilizando los nombres reales observados.

No crear adaptadores especulativos con diez nombres alternativos.

Si es necesario normalizar la respuesta, crear una única función de mapeo bien documentada después de conocer la forma real.

---

# 8. Rutas del frontend

La aplicación será multipágina, sin router de framework.

## Ruta principal

```text
/index.html
```

Responsabilidades:

- Navbar.
- Presentación de la plataforma.
- Barra de búsqueda.
- Filtros por categoría.
- Catálogo completo.
- Estado de carga.
- Estado vacío.
- Estado de error.
- Enlaces a login y registro.
- Estado de usuario autenticado.

---

## Ruta de inicio de sesión

```text
/pages/login.html
```

Responsabilidades:

- Campo `usuario`.
- Campo `password`.
- Validación previa.
- Integración con `POST /api/login`.
- Guardado seguro de la sesión sin almacenar contraseña.
- Redirección a catálogo después de login correcto.
- Enlace hacia registro.

Opcionalmente aceptar:

```text
?returnTo=...
```

solo si se implementa de forma sencilla y segura.

No aceptar URLs externas como destino de redirección.

---

## Ruta de registro

```text
/pages/registro.html
```

Responsabilidades:

- Carné.
- Nombre del estudiante.
- Correo.
- PIN.
- Confirmación del PIN.
- Validaciones.
- Integración con registro.
- Redirección a login después del registro correcto.

No realizar login automático después del registro.

---

## Ruta de detalle/reproductor

```text
/pages/video.html?id={videoId}
```

Ejemplo:

```text
/pages/video.html?id=3
```

Responsabilidades:

- Leer `id` con `URLSearchParams`.
- Validar que exista.
- Consultar `GET /api/videos/{id}`.
- Mostrar título.
- Mostrar descripción.
- Mostrar duración.
- Mostrar categoría.
- Reproducir el video.
- Mostrar Me gusta.
- Mostrar comentarios y respuestas si la API los devuelve.
- Permitir interacciones únicamente con sesión válida.

Si no hay `id`, mostrar un error de navegación y enlace de regreso al catálogo.

---

# 9. Estructura de carpetas objetivo

Respetar archivos existentes. Reorganizar únicamente si aporta claridad y sin romper commits previos innecesariamente.

Estructura objetivo:

```text
parcial-1/
├── index.html
├── README.md
├── AGENTS.md
├── package.json
├── css/
│   ├── styles.css
│   ├── auth.css
│   └── video.css
├── js/
│   ├── config.js
│   ├── api.js
│   ├── session.js
│   ├── validators.js
│   ├── ui.js
│   ├── catalog.js
│   ├── login.js
│   ├── registro.js
│   └── video.js
├── pages/
│   ├── login.html
│   ├── registro.html
│   └── video.html
├── tests/
│   ├── validators.test.js
│   ├── catalog.test.js
│   └── api.test.js
├── scripts/
│   └── smoke-api.mjs
└── docs/
    ├── API.md
    └── PRUEBAS.md
```

No crear carpetas vacías.

---

# 10. Responsabilidad de cada archivo JavaScript

## `js/config.js`

Únicamente configuración compartida:

- URL base de API.
- Nombre de clave de sesión si se desea centralizar.

---

## `js/api.js`

Debe ser la única capa que conozca directamente `fetch`.

Responsabilidades:

- Construcción de URL.
- Método HTTP.
- Headers JSON.
- Serialización del body.
- Parseo seguro de respuesta.
- Manejo consistente de errores HTTP.
- Funciones de API.

Funciones esperadas, ajustables al contrato observado:

```js
getVideos()
getVideoById(id)
getCategories()
getVideosByCategory(category)
registerStudent(data)
login(data)
toggleLike(videoId, carne)
createComment(videoId, data)
replyToComment(commentId, data)
deleteComment(commentId, carne)
```

No duplicar `fetch` directamente en `catalog.js`, `login.js`, etc.

---

## `js/session.js`

Responsabilidades:

- Guardar sesión.
- Recuperar sesión.
- Verificar si existe sesión.
- Eliminar sesión.

Clave recomendada:

```text
eduVideoSession
```

Nunca almacenar:

- PIN.
- Contraseña.
- Headers privados.
- Información no necesaria.

---

## `js/validators.js`

Funciones puras y testeables.

Mínimo:

```js
isValidCarne(value)
isValidEmail(value)
isValidPin(value)
isValidLoginUser(value)
validateRegistration(formData)
validateLogin(formData)
```

Carné:

```regex
^\d{4}-\d{2}-\d{5}$
```

PIN:

```regex
^\d+$
```

Correo:

Validación razonable de estructura sin intentar implementar todo RFC 5322.

---

## `js/ui.js`

Utilidades visuales compartidas:

- Mostrar mensajes.
- Mostrar/ocultar loader.
- Escapar o insertar contenido de forma segura.
- Actualizar navbar según sesión.
- Confirmación simple de eliminación si se implementa.

Preferir `textContent` sobre `innerHTML` para texto proveniente de usuarios o API.

---

## `js/catalog.js`

Responsabilidades:

- Carga inicial.
- Render de cards.
- Búsqueda.
- Categorías.
- Estado vacío.
- Estado de error.
- Navegación al detalle.

Mantener en memoria:

```js
allVideos
visibleVideos
selectedCategory
searchTerm
```

La búsqueda debe ser local y en tiempo real sobre el conjunto actualmente aplicable.

No realizar una llamada HTTP por cada tecla.

---

## `js/login.js`

Responsabilidades:

- Leer formulario.
- Validar.
- Llamar login.
- Interpretar respuesta.
- Guardar sesión.
- Redirigir.
- Mostrar errores.

---

## `js/registro.js`

Responsabilidades:

- Leer formulario.
- Validar.
- Confirmar PIN.
- Registrar.
- Mostrar resultado.
- Redirigir a login.

---

## `js/video.js`

Responsabilidades:

- Leer ID.
- Cargar detalle.
- Renderizar reproductor.
- Renderizar Me gusta.
- Renderizar comentarios.
- Validar sesión antes de mutaciones.
- Crear comentario.
- Responder.
- Eliminar comentario propio.
- Refrescar el estado desde la API después de mutaciones cuando sea necesario.

---

# 11. Flujo de aplicación

## 11.1 Visitante

```text
Abre index
→ carga catálogo
→ carga categorías
→ busca
→ filtra
→ abre video
→ reproduce video
```

Si intenta interactuar:

```text
Like / comentar / responder
→ verificar sesión
→ no existe
→ mostrar "Debes iniciar sesión para interactuar"
→ ofrecer navegación a login
```

---

## 11.2 Registro

```text
registro.html
→ completar formulario
→ validar
→ POST registro
→ éxito
→ mensaje
→ login.html
```

---

## 11.3 Login

```text
login.html
→ ingresar carné o correo
→ ingresar PIN
→ validar
→ POST login
→ verificar respuesta
→ obtener datos necesarios del estudiante
→ guardar sesión SIN PIN
→ index.html
```

---

## 11.4 Usuario autenticado

```text
index
→ navbar muestra identidad
→ abre video
→ Like / comentar / responder / eliminar propio
```

---

## 11.5 Cierre de sesión

```text
click Cerrar sesión
→ sessionStorage.removeItem(...)
→ actualizar estado visual
→ index.html
```

---

# 12. Búsqueda y filtros

## Búsqueda

Debe funcionar con evento `input`.

Reglas:

- No distinguir mayúsculas/minúsculas.
- Aplicar `trim()`.
- Buscar por título.
- Actualizar sin recargar página.
- Si no existen coincidencias, mostrar estado vacío.

Ejemplo conceptual:

```js
const normalizedTerm = searchTerm.trim().toLowerCase();

videos.filter(video =>
  video.titulo.toLowerCase().includes(normalizedTerm)
);
```

Ajustar `titulo` al nombre real observado.

---

## Categorías

Al cargar:

```text
GET /api/videos/categorias
```

Crear opciones dinámicamente.

Debe existir una opción local:

```text
Todos
```

Al seleccionar Todos:

```text
GET /api/videos
```

Al seleccionar una categoría:

```text
GET /api/videos/categoria/{nombreCategoria}
```

Después, si existe un término de búsqueda, aplicar la búsqueda local sobre el resultado de la categoría.

---

# 13. Diseño visual

No imitar Bootstrap.

Utilizar diseño moderno, limpio y académico.

## Paleta

Definir variables CSS en `:root`:

```css
:root {
  --color-bg: #f8fafc;
  --color-surface: #ffffff;
  --color-surface-alt: #eef2ff;
  --color-primary: #4f46e5;
  --color-primary-dark: #3730a3;
  --color-text: #0f172a;
  --color-muted: #64748b;
  --color-border: #e2e8f0;
  --color-success: #15803d;
  --color-danger: #b91c1c;
  --shadow-card: 0 12px 30px rgba(15, 23, 42, 0.08);
  --radius: 14px;
}
```

## Tipografía

Utilizar la pila del sistema:

```css
font-family:
  Inter,
  ui-sans-serif,
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  sans-serif;
```

No depender de Google Fonts.

## Catálogo

Grid responsive:

```css
grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
```

Las cards deben incluir:

- Póster con proporción estable.
- Título.
- Descripción resumida.
- Duración.
- Categoría.
- Botón de detalle/reproducción.

Usar `object-fit: cover` para pósters.

## Responsive

Mobile first.

Puntos de referencia sugeridos:

- Base: teléfonos.
- `640px`: tablets pequeñas.
- `900px`: escritorio.

Evitar valores rígidos que provoquen scroll horizontal.

---

# 14. Reproductor

El agente debe observar la forma real del campo de video.

Si la API entrega un archivo reproducible directamente:

```html
<video controls>
```

Si entrega una URL que requiere iframe y el origen permite embed:

```html
<iframe>
```

No asumir YouTube si no se observa YouTube.

No convertir URLs arbitrariamente.

Debe existir:

- Título del video.
- Reproductor.
- Mensaje de error si el recurso no puede reproducirse.
- Botón/enlace de regreso.

---

# 15. Comentarios

Renderizar con HTML semántico.

Ejemplo visual:

```text
Juan Pérez
Excelente explicación.
[Responder] [Eliminar]

    Carlos López
    Me ayudó bastante.
```

Reglas visuales:

- Respuestas con sangría.
- Solo comentario principal muestra `Responder`.
- `Eliminar` solo si el comentario pertenece al usuario actual.
- Botones con `data-*` para IDs.
- Usar delegación de eventos si simplifica el código.

Nunca insertar `texto` del comentario mediante HTML sin sanitización.

Preferir:

```js
element.textContent = comentario.texto;
```

---

# 16. Manejo de errores

Crear un error normalizado en `api.js`.

Como mínimo distinguir:

- Error de red.
- 400: datos inválidos.
- 401: credenciales inválidas/no autorizado.
- 403: acceso prohibido.
- 404: recurso no encontrado.
- 409: posible duplicado si la API lo utiliza.
- 500+: problema del servidor.

No depender de que el backend siempre devuelva JSON.

Intentar leer JSON cuando corresponda y tener fallback a texto.

La interfaz nunca debe quedar en estado de carga permanente después de un error.

---

# 17. Estados visuales obligatorios

Cada operación asíncrona relevante debe contemplar:

## Loading

Ejemplos:

```text
Cargando videos...
Iniciando sesión...
Publicando comentario...
```

Deshabilitar botones durante mutaciones para evitar doble envío.

## Éxito

Mostrar mensajes breves.

## Error

Mostrar mensaje claro y recuperable.

## Vacío

Ejemplos:

```text
No hay videos disponibles.
No se encontraron videos con tu búsqueda.
Aún no hay comentarios.
```

---

# 18. Seguridad básica del frontend

Aunque sea un parcial académico:

- Nunca guardar PIN.
- Nunca almacenar contraseña en `localStorage` o `sessionStorage`.
- Nunca registrar PIN en consola.
- No insertar texto remoto con `innerHTML` salvo contenido estático controlado.
- Utilizar `encodeURIComponent` para segmentos y parámetros dinámicos.
- No confiar en ocultar un botón como control real de autorización.
- No agregar credenciales, tokens o secretos al repositorio.
- No desactivar CORS mediante extensiones o trucos del navegador como solución de producción.
- No construir URLs de redirección externas con datos de query string.

---

# 19. Accesibilidad mínima

Cada página debe cumplir:

- `lang="es"`.
- `meta charset="UTF-8"`.
- `meta name="viewport"`.
- Labels asociados con `for`.
- Inputs con `id`.
- Botones reales para acciones.
- Links reales para navegación.
- `alt` descriptivo en imágenes.
- Focus visible.
- Contraste suficiente.
- Mensajes de formulario accesibles.
- Región `aria-live` para errores o mensajes dinámicos cuando sea razonable.
- No depender únicamente del color para comunicar errores.

---

# 20. Pruebas automatizadas

No instalar Jest, Vitest ni otra dependencia.

Crear `package.json` con:

```json
{
  "name": "parcial-1-desarrollo-web",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --test",
    "test:api": "node scripts/smoke-api.mjs"
  }
}
```

## 20.1 `tests/validators.test.js`

Cubrir mínimo:

### Carné válido

```text
1890-23-12105
```

Debe ser válido.

### Carnés inválidos

```text
18902312105
1890-2-12105
1890-23-1210
abcd-23-12105
1890 23 12105
```

Deben ser inválidos.

### PIN

Válidos:

```text
1234
0000
123456
```

Inválidos:

```text
12a4
12 34
abcd
```

### Correo

Probar al menos:

- válido normal.
- sin `@`.
- sin dominio.
- vacío.

### Login user

Debe aceptar:

- carné válido.
- correo válido.

Debe rechazar:

- texto arbitrario que no sea ninguno de los dos formatos.

---

## 20.2 `tests/catalog.test.js`

Extraer la lógica de filtrado a una función pura para poder probarla.

Cubrir:

- búsqueda exacta.
- búsqueda parcial.
- búsqueda sin distinguir mayúsculas.
- término vacío devuelve todos.
- término sin coincidencias devuelve arreglo vacío.
- no muta el arreglo original.

---

## 20.3 `tests/api.test.js`

Mockear `globalThis.fetch`.

Verificar como mínimo:

- URL de `getVideos`.
- URL codificada de categoría.
- método y body de registro.
- método y body de login.
- URL y body de Like.
- URL y body de comentario.
- URL y body de respuesta.
- URL de DELETE con carné codificado.
- manejo de un `403`.
- manejo de una respuesta no JSON si aplica.

No realizar llamadas reales desde estas pruebas unitarias.

---

# 21. Smoke tests contra API real

Crear:

```text
scripts/smoke-api.mjs
```

Este script SÍ puede consultar la API real, pero únicamente endpoints seguros de lectura.

Debe verificar:

1. `GET /api/videos`
2. `GET /api/videos/categorias`
3. Si existe al menos un video e identifica correctamente su ID:
   - `GET /api/videos/{id}`

Condiciones:

- Respuesta HTTP exitosa.
- Contenido legible.
- Imprimir resumen, no datos sensibles.
- Salir con código distinto de cero si falla.

No ejecutar automáticamente:

- Registro.
- Login.
- Like.
- Comentario.
- Respuesta.
- DELETE.

Los endpoints mutables deben probarse de forma manual/controlada para evitar contaminar la base de datos.

---

# 22. Pruebas manuales obligatorias

Documentar resultados en:

```text
docs/PRUEBAS.md
```

Utilizar una tabla con:

```text
ID | Caso | Precondición | Pasos | Resultado esperado | Resultado real | Estado
```

Casos mínimos:

## Catálogo

- CAT-01 carga catálogo.
- CAT-02 muestra error recuperable si falla API.
- CAT-03 búsqueda por título.
- CAT-04 búsqueda sin resultados.
- CAT-05 filtro por categoría.
- CAT-06 volver a Todos.

## Registro

- REG-01 registro con datos válidos.
- REG-02 carné con formato inválido.
- REG-03 correo inválido.
- REG-04 PIN con letras.
- REG-05 confirmación distinta.
- REG-06 carné duplicado, si puede probarse de manera controlada.
- REG-07 correo duplicado, si puede probarse de manera controlada.

## Login

- LOG-01 login con carné.
- LOG-02 login con correo.
- LOG-03 credenciales incorrectas.
- LOG-04 usuario vacío.
- LOG-05 PIN no numérico.

## Sesión

- SES-01 navbar cambia después del login.
- SES-02 sesión se conserva al navegar entre páginas en la misma pestaña.
- SES-03 logout elimina la sesión.
- SES-04 nunca se guarda el PIN.

## Video

- VID-01 abre detalle por ID.
- VID-02 ID inexistente.
- VID-03 URL sin ID.
- VID-04 reproducción funcional.

## Visitante

- GST-01 visitante puede ver videos.
- GST-02 Like solicita login.
- GST-03 comentar solicita login.
- GST-04 responder solicita login.

## Like

- LKE-01 agregar Like.
- LKE-02 volver a pulsar quita Like.
- LKE-03 contador/estado se actualiza según backend.

## Comentarios

- COM-01 publicar comentario principal.
- COM-02 no publicar texto vacío.
- COM-03 responder comentario principal.
- COM-04 respuesta no muestra botón Responder.
- COM-05 propietario ve Eliminar.
- COM-06 otro usuario no ve Eliminar.
- COM-07 eliminar comentario propio.
- COM-08 manejar `403` sin romper la interfaz si se fuerza el caso.

## Responsive

- RSP-01 375px.
- RSP-02 768px.
- RSP-03 1366px.
- RSP-04 sin scroll horizontal inesperado.

---

# 23. Protocolo de trabajo Git

Antes de tocar código, ejecutar:

```bash
git status --short
git branch --show-current
git log --oneline -10
```

Revisar:

- Rama actual.
- Cambios del usuario.
- Archivos no rastreados.
- Historial existente.

El historial conocido al momento de escribir este documento es:

```text
c630a08 Agrega CSS al HTML
80d5381 Agrega carpeta para JavaScript
c5e0759 Agrega CSS
c812e0c Agrega index.html
09ba629 Añade gitignore
```

No modificar esos commits.

No hacer:

```bash
git reset --hard
git rebase -i
git push --force
git clean -fd
```

salvo instrucción explícita del usuario.

Si existen cambios ajenos sin commit:

- No sobrescribirlos.
- Inspeccionarlos.
- Trabajar alrededor de ellos si es seguro.
- Si impiden continuar, detenerse y reportar el conflicto.

---

# 24. Convención de mensajes de commit

Seguir la nomenclatura actual:

```text
Añade ...
Agrega ...
Integra ...
Corrige ...
Mejora ...
Documenta ...
```

Reglas:

- Español.
- Una sola intención.
- Sin prefijo `feat:`, `fix:`, etc.
- Sin punto final.
- Preferentemente menos de 72 caracteres.
- Describir qué aporta el commit.
- No usar mensajes vagos como `cambios`, `avance`, `fix` o `final`.

Ejemplos correctos:

```text
Agrega navegación principal
Integra catálogo con la API
Agrega validación de carné y PIN
Integra inicio de sesión
Agrega pruebas de validación
Documenta casos de prueba
```

---

# 25. Plan obligatorio de commits

El agente debe mantener commits pequeños y funcionales. Puede ajustar un commit si el estado actual del repositorio ya contiene parte de la funcionalidad, pero debe conservar el orden lógico y la separación por responsabilidad.

## Commit 1

```text
Agrega documentación base del proyecto
```

Incluye:

- `README.md` inicial.
- Datos del estudiante.
- Objetivo.
- Stack.
- Instrucciones para ejecutar.
- Enlace o referencia a documentación.

No mezclar código funcional nuevo.

---

## Commit 2

```text
Organiza estilos base de la aplicación
```

Incluye:

- Variables CSS.
- Reset mínimo.
- Tipografía.
- Contenedores.
- Botones.
- Inputs.
- Estados de mensajes.

Debe mantener `index.html` visible y funcional.

---

## Commit 3

```text
Agrega navegación principal y pie de página
```

Incluye:

- Navbar.
- Logo/nombre textual.
- Links.
- Footer con:
  - Albino Sebastián Rosales Ruano.
  - 1890-23-12105.

---

## Commit 4

```text
Agrega configuración y cliente de API
```

Incluye:

- `js/config.js`.
- `js/api.js`.
- Manejo base de HTTP.
- Sin implementar todavía toda la interfaz.

Ejecutar pruebas de API unitarias iniciales si ya existen.

---

## Commit 5

```text
Documenta contrato observado de la API
```

Incluye:

- `docs/API.md`.
- Respuestas reales observadas de GET.
- Campos importantes.
- Notas de comentarios/likes.

No almacenar información sensible.

---

## Commit 6

```text
Integra catálogo de videos
```

Incluye:

- `GET /api/videos`.
- Render de cards.
- Loader.
- Error.
- Vacío.

Debe poder demostrarse desde `index.html`.

---

## Commit 7

```text
Agrega búsqueda de videos por título
```

Incluye:

- Input.
- Evento `input`.
- Normalización.
- Filtrado local.
- Mensaje sin resultados.

---

## Commit 8

```text
Integra filtros por categoría
```

Incluye:

- `GET /api/videos/categorias`.
- Selector dinámico.
- `GET /api/videos/categoria/{nombreCategoria}`.
- Opción Todos.
- Combinación con búsqueda.

---

## Commit 9

```text
Agrega vista de detalle del video
```

Incluye:

- `pages/video.html`.
- Lectura de `id`.
- `GET /api/videos/{id}`.
- Información detallada.
- Regreso al catálogo.

---

## Commit 10

```text
Integra reproductor de video
```

Incluye:

- Reproductor según el tipo real de URL.
- Manejo de recurso faltante.
- Diseño responsive.

---

## Commit 11

```text
Agrega validaciones de formularios
```

Incluye:

- `validators.js`.
- Carné.
- Correo.
- PIN.
- Login user.
- Funciones puras.

Debe incluir pruebas unitarias del validador en el mismo commit si el entorno de pruebas ya está preparado; de lo contrario, preparar las pruebas en el commit específico de testing.

---

## Commit 12

```text
Agrega formulario de registro
```

Incluye:

- `pages/registro.html`.
- Campos.
- Errores visuales.
- Confirmación de PIN.
- Aún puede utilizar un handler preparado para integración.

No enviar datos si la validación falla.

---

## Commit 13

```text
Integra registro de estudiantes
```

Incluye:

- POST real.
- Manejo de errores.
- Duplicados según respuesta real.
- Redirección a login.

---

## Commit 14

```text
Agrega formulario de inicio de sesión
```

Incluye:

- `pages/login.html`.
- Usuario.
- PIN.
- Validación.
- Mensajes.

---

## Commit 15

```text
Integra inicio de sesión y manejo de sesión
```

Incluye:

- POST login.
- `session.js`.
- `sessionStorage`.
- Navbar autenticada.
- Logout.
- No guardar PIN.

---

## Commit 16

```text
Agrega control de acceso para interacciones
```

Incluye:

- Guard centralizado.
- Visitante no puede mutar.
- Mensaje y enlace a login.
- Sin duplicar validaciones en cada botón si puede evitarse.

---

## Commit 17

```text
Integra reacción de Me gusta
```

Incluye:

- Toggle Like.
- Usuario autenticado.
- Refresco seguro.
- Estado loading.
- Manejo de error.

---

## Commit 18

```text
Integra comentarios principales
```

Incluye:

- Render de comentarios observados en API.
- Formulario.
- POST comentario.
- Texto vacío bloqueado.
- Refresco.

Si la API no expone comentarios en ningún GET proporcionado, documentar la limitación y no inventar endpoint.

---

## Commit 19

```text
Integra respuestas de comentarios
```

Incluye:

- Botón Responder solo en comentarios principales.
- POST respuesta.
- Un nivel de anidamiento.
- Refresco.

---

## Commit 20

```text
Integra eliminación de comentarios propios
```

Incluye:

- Comparación de propietario.
- Botón solo para propietario.
- Confirmación.
- DELETE.
- Manejo 403.
- Refresco.

---

## Commit 21

```text
Agrega pruebas automatizadas
```

Incluye:

- `package.json`.
- `validators.test.js`.
- `catalog.test.js`.
- `api.test.js`.
- Todas las pruebas pasan.

---

## Commit 22

```text
Agrega pruebas de contrato de la API
```

Incluye:

- `scripts/smoke-api.mjs`.
- Solo GET.
- `npm run test:api`.

---

## Commit 23

```text
Mejora diseño responsivo y accesibilidad
```

Incluye:

- Revisión 375px, 768px, 1366px.
- Focus.
- Labels.
- `aria-live`.
- Contraste.
- Ajustes de cards/reproductor/comentarios.

No reescribir toda la aplicación.

---

## Commit 24

```text
Documenta pruebas y uso final
```

Incluye:

- `docs/PRUEBAS.md`.
- README final.
- Rutas.
- Cómo ejecutar.
- Cómo probar.
- Funcionalidades.
- Limitaciones reales, si existen.

---

# 26. Validaciones antes de cada commit

Antes de crear cualquier commit:

```bash
git status --short
git diff --check
npm test
```

Si el commit toca integración con GET de API y existe acceso a red:

```bash
npm run test:api
```

Además:

- Abrir la página correspondiente.
- Confirmar que no existe error visible en consola.
- Probar la funcionalidad específica del commit.
- Revisar `git diff`.
- Verificar que el commit no incluya archivos ajenos.

Luego:

```bash
git add <archivos-intencionales>
git diff --cached
git commit -m "Mensaje"
```

No usar rutinariamente:

```bash
git add .
```

si existen archivos no relacionados.

---

# 27. Protocolo después de cada commit

Después del commit:

```bash
git status --short
git log -1 --oneline
```

Debe quedar:

- Commit creado correctamente.
- Sin archivos accidentales.
- Sin estado roto.

Si una prueba falla:

- No crear el commit como si estuviera terminado.
- Corregir primero.
- Ejecutar nuevamente.
- Documentar un bloqueo real si no puede resolverse.

---

# 28. Ejecución local

Por utilizar ES Modules, no abrir las páginas únicamente mediante `file://`.

Servir el proyecto por HTTP.

Opción Python:

```bash
python -m http.server 5500
```

Luego:

```text
http://localhost:5500/
```

También se permite VS Code Live Server.

Documentar la opción utilizada en README.

---

# 29. README final obligatorio

El `README.md` debe contener como mínimo:

1. Nombre del proyecto.
2. Descripción.
3. Autor.
4. Carné.
5. Curso.
6. Stack.
7. Estructura del proyecto.
8. Rutas del frontend.
9. Endpoints consumidos.
10. Cómo ejecutar localmente.
11. Cómo ejecutar pruebas.
12. Funcionalidades de visitante.
13. Funcionalidades de autenticado.
14. Reglas de validación.
15. Capturas, únicamente si el usuario decide agregarlas.
16. Notas o limitaciones reales.
17. Estado del proyecto.

No escribir documentación falsa.

---

# 30. Criterios de aceptación por serie

## Serie I — Autenticación, Registro y Validación

Se considera completa cuando:

- Registro consume endpoint correcto.
- Carné exige máscara.
- Correo se valida.
- PIN solo numérico.
- Duplicados se muestran según backend.
- Login acepta carné o correo.
- Sesión funciona.
- No se guarda PIN.

---

## Serie II — Interfaz, Catálogo y Navegación

Se considera completa cuando:

- Catálogo muestra cards.
- Cards tienen información requerida disponible.
- Categorías vienen de API.
- Filtro funciona.
- Búsqueda en tiempo real funciona.
- Detalle funciona.
- Video se reproduce.
- Visitante puede navegar.
- Controles privados están bloqueados o redirigen a login.

---

## Serie III — Interacción y Comentarios

Se considera completa cuando:

- Like funciona como toggle.
- Comentario principal funciona.
- Respuesta funciona.
- Solo existe un nivel de respuestas.
- Usuario puede eliminar su propio comentario.
- No puede eliminar comentarios ajenos.
- `403` se maneja correctamente.
- UI se sincroniza con respuesta real del backend.

---

# 31. Definition of Done final

El proyecto NO está terminado hasta que:

- [ ] `index.html` funciona.
- [ ] Login funciona.
- [ ] Registro funciona.
- [ ] Catálogo funciona.
- [ ] Búsqueda funciona.
- [ ] Categorías funcionan.
- [ ] Detalle funciona.
- [ ] Reproductor funciona.
- [ ] `sessionStorage` funciona.
- [ ] Logout funciona.
- [ ] Visitante no puede interactuar.
- [ ] Like funciona como toggle.
- [ ] Comentario principal funciona.
- [ ] Respuesta funciona.
- [ ] No hay respuestas de segundo nivel.
- [ ] Eliminación propia funciona.
- [ ] `403` se maneja.
- [ ] Diseño es responsive.
- [ ] No hay scroll horizontal accidental.
- [ ] No se almacena el PIN.
- [ ] No hay secretos en Git.
- [ ] `npm test` pasa.
- [ ] `npm run test:api` pasa cuando la API está disponible.
- [ ] `git diff --check` pasa.
- [ ] No existen errores de consola relevantes.
- [ ] `README.md` está completo.
- [ ] `docs/API.md` refleja la API real.
- [ ] `docs/PRUEBAS.md` contiene resultados.
- [ ] Los commits son pequeños y funcionales.
- [ ] El repositorio queda limpio.

---

# 32. Reglas de autonomía del agente

El agente puede:

- Crear archivos definidos en este documento.
- Refactorizar código creado durante la tarea cuando sea necesario.
- Corregir errores directamente relacionados.
- Añadir pruebas sin pedir permiso.
- Mejorar accesibilidad y responsive dentro del alcance.
- Ajustar nombres internos para coincidir con la API real.

El agente NO puede sin autorización:

- Cambiar el stack.
- Agregar frameworks.
- Cambiar la API base.
- Inventar endpoints.
- Cambiar reglas de negocio.
- Eliminar funcionalidades del parcial.
- Borrar archivos del usuario sin necesidad.
- Reescribir commits anteriores.
- Hacer `push`.
- Hacer `force-push`.
- Cambiar de rama de manera destructiva.
- Guardar credenciales.
- Utilizar el carné personal del estudiante para poblar automáticamente la API si esto crea datos no deseados.

---

# 33. Política para dudas y bloqueos

No detenerse por detalles menores que puedan resolverse inspeccionando el código o la API.

Detenerse y reportar únicamente cuando:

- El contrato real contradice el enunciado de forma que impide una funcionalidad.
- Falta un endpoint imprescindible.
- Login no devuelve información necesaria para las interacciones y no existe forma legítima de obtenerla.
- CORS bloquea el frontend real.
- El repositorio contiene cambios del usuario que serían sobrescritos.
- Una decisión implicaría cambiar de stack o regla de negocio.
- Se requiere una operación destructiva de Git.

Cuando haya bloqueo, reportar:

```text
BLOQUEO
- Punto:
- Evidencia:
- Impacto:
- Opciones:
- Recomendación:
```

No inventar una solución silenciosa.

---

# 34. Formato de reporte de avance del agente

Después de cada grupo razonable de trabajo, reportar:

```text
FASE COMPLETADA
- Funcionalidad:
- Archivos modificados:
- Pruebas ejecutadas:
- Resultado:
- Commit:
- Siguiente paso:
```

Si todo pasa:

```text
Resultado: PASS
```

Si algo no pasa:

```text
Resultado: BLOCKED
```

o:

```text
Resultado: FAIL
```

con explicación.

---

# 35. Prioridad de implementación

Ante cualquier conflicto de tiempo, priorizar en este orden:

1. Funcionalidad exigida por el parcial.
2. Integración real con API.
3. Validaciones.
4. Manejo de sesión.
5. Pruebas.
6. Responsive.
7. Accesibilidad.
8. Pulido visual adicional.

No sacrificar una función del parcial para añadir animaciones o decoración.

---

# 36. Principio final

La solución debe ser:

- Simple.
- Correcta.
- Comprensible.
- Demostrable.
- Probada.
- Documentada.
- Defendible oralmente por un estudiante de Desarrollo Web I.

Evitar sobreingeniería.

Cada decisión debe poder explicarse con HTML, CSS, JavaScript, Fetch API, HTTP y almacenamiento de sesión del navegador.
