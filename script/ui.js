import { clearSession, getSession } from './session.js';

export function formatDuration(value) {
  return String(value ?? '').trim() || 'Duración no disponible';
}

export function formatDate(value) {
  if (!value) {
    return '';
  }

  return String(value);
}

export function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

export function setStatus(target, message, tone = 'info') {
  if (!target) {
    return;
  }

  target.textContent = message;
  target.dataset.tone = tone;
  target.hidden = !message;
}

export function setLoading(target, isLoading, message = 'Cargando...') {
  if (!target) {
    return;
  }

  target.hidden = !isLoading;
  target.textContent = isLoading ? message : '';
}

export function getInternalReturnTo(searchParams) {
  const value = searchParams.get('returnTo');
  if (!value) {
    return '/index.html';
  }

  if (!value.startsWith('/') || value.startsWith('//')) {
    return '/index.html';
  }

  return value;
}

export function renderNavbar() {
  const session = getSession();
  const identity = document.querySelector('[data-user-identity]');
  const authActions = document.querySelector('[data-auth-actions]');

  if (identity) {
    clearElement(identity);

    if (session) {
      const badge = document.createElement('span');
      badge.className = 'user-badge';
      badge.textContent = `${session.nombre || 'Estudiante'} · ${session.carne}`;
      identity.appendChild(badge);
    } else {
      const text = document.createElement('span');
      text.className = 'muted';
      text.textContent = 'Visitante';
      identity.appendChild(text);
    }
  }

  if (authActions) {
    clearElement(authActions);

    if (session) {
      const logoutButton = document.createElement('button');
      logoutButton.type = 'button';
      logoutButton.className = 'button button-secondary';
      logoutButton.textContent = 'Cerrar sesión';
      logoutButton.addEventListener('click', () => {
        clearSession();
        window.location.href = '/index.html';
      });
      authActions.appendChild(logoutButton);
    } else {
      const loginLink = document.createElement('a');
      loginLink.className = 'button button-secondary';
      loginLink.href = '/pages/login.html';
      loginLink.textContent = 'Iniciar sesión';

      const registerLink = document.createElement('a');
      registerLink.className = 'button';
      registerLink.href = '/pages/registro.html';
      registerLink.textContent = 'Registrarse';

      authActions.append(loginLink, registerLink);
    }
  }
}

export function createCallout(message, tone = 'info') {
  const callout = document.createElement('div');
  callout.className = `callout callout-${tone}`;
  callout.textContent = message;
  return callout;
}

export function getSessionLabel() {
  const session = getSession();
  return session ? `${session.nombre || 'Estudiante'} (${session.carne})` : 'Visitante';
}
