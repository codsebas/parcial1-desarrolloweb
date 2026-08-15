import { API_BASE_URL } from './config.js';

export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

function buildUrl(path) {
  return `${API_BASE_URL}${path}`;
}

function normalizeCollection(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && Array.isArray(payload.value)) {
    return payload.value;
  }

  if (payload && Array.isArray(payload.data)) {
    return payload.data;
  }

  if (payload && Array.isArray(payload.items)) {
    return payload.items;
  }

  return [];
}

async function parseResponse(response) {
  const raw = await response.text();

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

export async function request(path, { method = 'GET', body } = {}) {
  let response;

  try {
    response = await fetch(buildUrl(path), {
      method,
      headers: {
        Accept: 'application/json',
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
  } catch {
    throw new ApiError('No fue posible conectar con la API.', 0);
  }

  const data = await parseResponse(response);

  if (!response.ok) {
    const message =
      data && typeof data === 'object' && 'mensaje' in data
        ? data.mensaje
        : `La API respondió con error ${response.status}.`;

    throw new ApiError(message, response.status, data);
  }

  return data;
}

export async function getVideos() {
  return normalizeCollection(await request('/api/videos'));
}

export async function getVideoById(id) {
  return request(`/api/videos/${encodeURIComponent(id)}`);
}

export async function getCategories() {
  return normalizeCollection(await request('/api/videos/categorias'));
}

export async function getVideosByCategory(category) {
  return normalizeCollection(
    await request(`/api/videos/categoria/${encodeURIComponent(category)}`),
  );
}

export async function registerStudent(data) {
  return request('/api/estudiantes/registrar', {
    method: 'POST',
    body: {
      carne: data.carne,
      estudiante: data.estudiante,
      correo: data.correo,
      password: data.password,
    },
  });
}

export async function login(data) {
  return request('/api/login', {
    method: 'POST',
    body: {
      usuario: data.usuario,
      password: data.password,
    },
  });
}

export async function toggleLike(videoId, carne) {
  return request(`/api/interaccionvideo/${encodeURIComponent(videoId)}/like`, {
    method: 'POST',
    body: { carne },
  });
}

export async function createComment(videoId, data) {
  return request(`/api/interaccionvideo/${encodeURIComponent(videoId)}/comentario`, {
    method: 'POST',
    body: {
      carne: data.carne,
      texto: data.texto,
    },
  });
}

export async function replyToComment(commentId, data) {
  return request(`/api/interaccionvideo/comentario/${encodeURIComponent(commentId)}/responder`, {
    method: 'POST',
    body: {
      carne: data.carne,
      texto: data.texto,
    },
  });
}

export async function deleteComment(commentId, carne) {
  return request(
    `/api/interaccionvideo/comentario/${encodeURIComponent(commentId)}?carne=${encodeURIComponent(carne)}`,
    {
      method: 'DELETE',
    },
  );
}
