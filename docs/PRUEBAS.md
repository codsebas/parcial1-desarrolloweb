# Pruebas manuales

ID | Caso | Precondición | Pasos | Resultado esperado | Resultado real | Estado
---|---|---|---|---|---|---
CAT-01 | Carga catálogo | API disponible | Abrir `index.html` | Lista de videos visible | Pendiente | Pendiente
CAT-02 | Error recuperable | API caída | Abrir `index.html` sin API | Mensaje de error claro | Pendiente | Pendiente
CAT-03 | Búsqueda por título | Catálogo cargado | Escribir un título | Filtra resultados | Pendiente | Pendiente
CAT-04 | Sin resultados | Catálogo cargado | Escribir término inexistente | Estado vacío | Pendiente | Pendiente
CAT-05 | Filtro por categoría | Catálogo cargado | Elegir una categoría | Lista filtrada | Pendiente | Pendiente
CAT-06 | Volver a Todos | Filtro activo | Elegir `Todos` | Regresa al catálogo completo | Pendiente | Pendiente
REG-01 | Registro válido | Ninguno | Completar formulario correcto | Registro exitoso | Pendiente | Pendiente
REG-02 | Carné inválido | Ninguno | Poner carné inválido | Error de formato | Pendiente | Pendiente
REG-03 | Correo inválido | Ninguno | Poner correo inválido | Error de correo | Pendiente | Pendiente
REG-04 | PIN con letras | Ninguno | Poner PIN alfanumérico | Error de PIN | Pendiente | Pendiente
REG-05 | Confirmación distinta | Ninguno | Poner PIN diferente | Error de confirmación | Pendiente | Pendiente
REG-06 | Carné duplicado | Carné existente | Registrar con carné repetido | Backend devuelve 409 | Pendiente | Pendiente
REG-07 | Correo duplicado | Correo existente | Registrar con correo repetido | Backend devuelve 409 | Pendiente | Pendiente
LOG-01 | Login con carné | Usuario registrado | Ingresar carné y PIN | Sesión iniciada | Pendiente | Pendiente
LOG-02 | Login con correo | Usuario registrado | Ingresar correo y PIN | Sesión iniciada | Pendiente | Pendiente
LOG-03 | Credenciales incorrectas | Ninguno | Ingresar datos inválidos | Error 401 | Pendiente | Pendiente
LOG-04 | Usuario vacío | Ninguno | Dejar usuario vacío | Validación local | Pendiente | Pendiente
LOG-05 | PIN no numérico | Ninguno | Escribir letras en PIN | Validación local | Pendiente | Pendiente
SES-01 | Navbar cambia | Sesión activa | Iniciar sesión | Muestra identidad | Pendiente | Pendiente
SES-02 | Persistencia en pestaña | Sesión activa | Navegar entre páginas | Sesión conservada | Pendiente | Pendiente
SES-03 | Logout | Sesión activa | Cerrar sesión | SessionStorage limpio | Pendiente | Pendiente
SES-04 | No guardar PIN | Sesión activa | Revisar storage | PIN no existe | Pendiente | Pendiente
VID-01 | Abre detalle | ID válido | Abrir `video.html?id=...` | Detalle visible | Pendiente | Pendiente
VID-02 | ID inexistente | Ninguno | Usar ID inválido | Error claro | Pendiente | Pendiente
VID-03 | URL sin ID | Ninguno | Abrir `video.html` | Error de navegación | Pendiente | Pendiente
VID-04 | Reproducción | Video válido | Abrir detalle | Video reproduce | Pendiente | Pendiente
GST-01 | Visitante ve videos | Ninguno | Abrir catálogo | Puede navegar | Pendiente | Pendiente
GST-02 | Like pide login | Ninguno | Abrir video y pulsar like | Mensaje de login | Pendiente | Pendiente
GST-03 | Comentar pide login | Ninguno | Abrir video y comentar | Mensaje de login | Pendiente | Pendiente
GST-04 | Responder pide login | Ninguno | Abrir video y responder | Mensaje de login | Pendiente | Pendiente
LKE-01 | Agregar Like | Sesión activa | Pulsar Me gusta | Like agregado | Pendiente | Pendiente
LKE-02 | Quitar Like | Like activo | Pulsar de nuevo | Like removido | Pendiente | Pendiente
LKE-03 | Estado sincronizado | Sesión activa | Refrescar detalle | UI refleja backend | Pendiente | Pendiente
COM-01 | Comentario principal | Sesión activa | Escribir comentario | Se publica | Pendiente | Pendiente
COM-02 | Texto vacío | Sesión activa | Enviar vacío | Validación local | Pendiente | Pendiente
COM-03 | Responder comentario | Sesión activa | Responder comentario principal | Se publica respuesta | Pendiente | Pendiente
COM-04 | Respuesta sin botón | Datos cargados | Revisar una respuesta | No muestra responder | Pendiente | Pendiente
COM-05 | Propietario ve eliminar | Sesión propia | Revisar comentario propio | Botón visible | Pendiente | Pendiente
COM-06 | Otro usuario no ve eliminar | Sesión distinta | Revisar comentario ajeno | Botón oculto | Pendiente | Pendiente
COM-07 | Eliminar propio | Sesión propia | Pulsar eliminar | Se elimina | Pendiente | Pendiente
COM-08 | Manejo 403 | Comentario ajeno | Forzar borrado | Mensaje sin romper UI | Pendiente | Pendiente
RSP-01 | 375px | Navegador móvil | Revisar layout | Sin desbordes | Pendiente | Pendiente
RSP-02 | 768px | Tablet | Revisar layout | Sin desbordes | Pendiente | Pendiente
RSP-03 | 1366px | Escritorio | Revisar layout | Correcto | Pendiente | Pendiente
