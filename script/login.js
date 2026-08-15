import { login } from './api.js';
import { getInternalReturnTo, renderNavbar, setStatus } from './ui.js';
import { saveSession } from './session.js';
import { validateLogin } from './validators.js';

function getElements() {
  return {
    form: document.querySelector('[data-login-form]'),
    status: document.querySelector('[data-login-status]'),
    submit: document.querySelector('[data-login-submit]'),
  };
}

function setFormError(form, fieldName, message) {
  const field = form.querySelector(`[name="${fieldName}"]`);
  const error = form.querySelector(`[data-error-for="${fieldName}"]`);

  if (error) {
    error.textContent = message || '';
  }

  if (field) {
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
  }
}

function clearErrors(form) {
  for (const error of form.querySelectorAll('[data-error-for]')) {
    error.textContent = '';
  }

  for (const field of form.querySelectorAll('[aria-invalid]')) {
    field.setAttribute('aria-invalid', 'false');
  }
}

export async function bootstrapLoginPage() {
  renderNavbar();

  const { form, status, submit } = getElements();
  if (!form) {
    return;
  }

  const returnTo = getInternalReturnTo(new URLSearchParams(window.location.search));

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearErrors(form);

    const formData = Object.fromEntries(new FormData(form).entries());
    const validation = validateLogin(formData);

    if (!validation.valid) {
      for (const [fieldName, message] of Object.entries(validation.errors)) {
        setFormError(form, fieldName, message);
      }
      setStatus(status, 'Corrige los campos marcados.', 'warning');
      return;
    }

    if (submit) {
      submit.disabled = true;
    }
    setStatus(status, 'Iniciando sesión...', 'info');

    try {
      const response = await login({
        usuario: formData.usuario,
        password: formData.password,
      });

      const student = response.estudiante ?? response.student ?? response;
      saveSession(student);
      window.location.href = returnTo;
    } catch (error) {
      setStatus(status, error.message || 'No fue posible iniciar sesión.', 'danger');
    } finally {
      if (submit) {
        submit.disabled = false;
      }
    }
  });
}

if (typeof document !== 'undefined') {
  const hasLoginPage = document.querySelector('[data-login-page]');
  if (hasLoginPage) {
    document.addEventListener('DOMContentLoaded', () => {
      bootstrapLoginPage();
    });
  }
}
