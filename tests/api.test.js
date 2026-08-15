import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ApiError,
  createComment,
  deleteComment,
  getVideos,
  login,
  registerStudent,
  request,
  replyToComment,
  toggleLike,
} from '../script/api.js';

const BASE = 'https://backvideo-hpevgdenh7hygvfm.canadacentral-01.azurewebsites.net';

function mockFetch(response) {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, options = {}) => ({
    ok: response.ok,
    status: response.status,
    text: async () => response.body,
    url,
    options,
  });

  return () => {
    globalThis.fetch = originalFetch;
  };
}

test('getVideos usa la URL correcta', async () => {
  const restore = globalThis.fetch;
  let calledUrl = '';
  globalThis.fetch = async (url) => {
    calledUrl = url;
    return {
      ok: true,
      status: 200,
      text: async () => '{"value":[],"Count":0}',
    };
  };

  await getVideos();
  assert.equal(calledUrl, `${BASE}/api/videos`);
  globalThis.fetch = restore;
});

test('request maneja respuesta de texto sin JSON', async () => {
  const restore = mockFetch({ ok: true, status: 200, body: 'OK' });
  try {
    const result = await request('/api/saludo');
    assert.equal(result, 'OK');
  } finally {
    restore();
  }
});

test('categoría codificada y bodies de mutación', async () => {
  const restore = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options = {}) => {
    calls.push({ url, options });
    return {
      ok: true,
      status: 200,
      text: async () => '{"mensaje":"ok"}',
    };
  };

  await registerStudent({ carne: '1890-23-12105', estudiante: 'Juan Perez', correo: 'juan@correo.com', password: '1234' });
  await login({ usuario: '1890-23-12105', password: '1234' });
  await toggleLike(10, '1890-23-12105');
  await createComment(10, { carne: '1890-23-12105', texto: 'Hola' });
  await replyToComment(5, { carne: '1890-23-12105', texto: 'Respuesta' });
  await deleteComment(5, '1890-23-12105');

  try {
    assert.equal(calls[0].url, `${BASE}/api/estudiantes/registrar`);
    assert.equal(calls[0].options.method, 'POST');
    assert.equal(calls[0].options.body, JSON.stringify({ carne: '1890-23-12105', estudiante: 'Juan Perez', correo: 'juan@correo.com', password: '1234' }));

    assert.equal(calls[1].url, `${BASE}/api/login`);
    assert.equal(calls[1].options.method, 'POST');
    assert.equal(calls[1].options.body, JSON.stringify({ usuario: '1890-23-12105', password: '1234' }));

    assert.equal(calls[2].url, `${BASE}/api/interaccionvideo/10/like`);
    assert.equal(calls[2].options.body, JSON.stringify({ carne: '1890-23-12105' }));

    assert.equal(calls[3].url, `${BASE}/api/interaccionvideo/10/comentario`);
    assert.equal(calls[3].options.body, JSON.stringify({ carne: '1890-23-12105', texto: 'Hola' }));

    assert.equal(calls[4].url, `${BASE}/api/interaccionvideo/comentario/5/responder`);
    assert.equal(calls[4].options.body, JSON.stringify({ carne: '1890-23-12105', texto: 'Respuesta' }));

    assert.equal(calls[5].url, `${BASE}/api/interaccionvideo/comentario/5?carne=1890-23-12105`);
    assert.equal(calls[5].options.method, 'DELETE');
  } finally {
    globalThis.fetch = restore;
  }
});

test('request convierte 403 en ApiError', async () => {
  const restore = mockFetch({ ok: false, status: 403, body: '{"mensaje":"Acceso denegado"}' });
  try {
    await assert.rejects(() => request('/api/protegido'), (error) => {
      assert.ok(error instanceof ApiError);
      assert.equal(error.status, 403);
      assert.equal(error.message, 'Acceso denegado');
      return true;
    });
  } finally {
    restore();
  }
});
