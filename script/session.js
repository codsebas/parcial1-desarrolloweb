import { SESSION_KEY } from './config.js';

export function saveSession(student) {
  const payload = {
    carne: student.carne,
    nombre: student.nombre ?? student.estudiante ?? '',
    correo: student.correo ?? '',
  };

  sessionStorage.setItem(SESSION_KEY, JSON.stringify(payload));
  return payload;
}

export function getSession() {
  const raw = sessionStorage.getItem(SESSION_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }

    return {
      carne: parsed.carne ?? '',
      nombre: parsed.nombre ?? '',
      correo: parsed.correo ?? '',
    };
  } catch {
    return null;
  }
}

export function hasSession() {
  return Boolean(getSession());
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}
