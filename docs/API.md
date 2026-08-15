# Contrato observado de la API

Base URL:

`https://backvideo-hpevgdenh7hygvfm.canadacentral-01.azurewebsites.net`

## GET /api/videos

Respuesta observada:

```json
{
  "value": [
    {
      "id": 1,
      "titulo": "...",
      "descripcion": "...",
      "categoria": "...",
      "duracion": "00:06",
      "urlVideo": "...",
      "poster": "...",
      "likes": 1,
      "usuariosLikes": ["1890-17-15352"],
      "comentarios": []
    }
  ],
  "Count": 10
}
```

Campos útiles observados:

- `id`
- `titulo`
- `descripcion`
- `categoria`
- `duracion`
- `urlVideo`
- `poster`
- `likes`
- `usuariosLikes`
- `comentarios`

## GET /api/videos/{id}

Devuelve un objeto de video con la misma estructura del elemento dentro de `value`.

Los comentarios vienen anidados en:

- `comentarios[]`
- `comentarios[].respuestas[]`

## GET /api/videos/categorias

Respuesta observada:

```json
{
  "value": ["Desarrollo Web", "Diseño Web"],
  "Count": 10
}
```

## GET /api/videos/categoria/{nombreCategoria}

Respuesta observada para `DevOps`:

```json
{
  "value": [
    {
      "id": 8,
      "titulo": "Despliegue Continuo (CI/CD) en la Nube",
      "categoria": "DevOps"
    }
  ],
  "Count": 1
}
```

## POST /api/estudiantes/registrar

Ejemplo de respuesta exitosa:

```json
{
  "mensaje": "Estudiante registrado exitosamente.",
  "estudiante": {
    "carne": "1890-26-81501",
    "nombre": "PRUEBA AGENTE",
    "correo": "prueba.agente.81501@example.com"
  }
}
```

Ejemplo de error duplicado:

```json
{
  "mensaje": "El carné ingresado ya se encuentra registrado."
}
```

## POST /api/login

Respuesta exitosa observada:

```json
{
  "mensaje": "Inicio de sesión exitoso",
  "estudiante": {
    "carne": "1890-26-81501",
    "nombre": "PRUEBA AGENTE",
    "correo": "prueba.agente.81501@example.com"
  }
}
```

Error observado:

```json
{
  "mensaje": "Credenciales incorrectas. Verifica tu usuario y contraseña."
}
```

## POST /api/interaccionvideo/{videoId}/like

Respuesta de alta:

```json
{
  "mensaje": "Like registrado exitosamente",
  "likesTotales": 1,
  "dioLike": true
}
```

Respuesta de toggle inverso:

```json
{
  "mensaje": "Like removido",
  "likesTotales": 0,
  "dioLike": false
}
```

## POST /api/interaccionvideo/{videoId}/comentario

```json
{
  "mensaje": "Comentario publicado exitosamente.",
  "comentario": {
    "id": 104,
    "carne": "1890-26-81501",
    "estudiante": "PRUEBA AGENTE",
    "texto": "Comentario de prueba...",
    "fecha": "2026-08-15 20:38:03",
    "respuestas": []
  }
}
```

## POST /api/interaccionvideo/comentario/{comentarioId}/responder

```json
{
  "mensaje": "Respuesta agregada exitosamente.",
  "respuesta": {
    "id": 1002,
    "carne": "1890-26-81501",
    "estudiante": "PRUEBA AGENTE",
    "texto": "Respuesta de prueba...",
    "fecha": "2026-08-15 20:38:03"
  }
}
```

## DELETE /api/interaccionvideo/comentario/{comentarioId}?carne={carne}

Respuesta exitosa:

```json
{
  "mensaje": "Comentario eliminado exitosamente."
}
```

Error observado al intentar borrar un comentario ajeno:

```json
{
  "mensaje": "Acceso denegado: No puedes eliminar comentarios escritos por otros estudiantes."
}
```
