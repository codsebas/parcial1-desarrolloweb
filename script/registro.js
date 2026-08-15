import { registerStudent } from './api.js';
import { renderNavbar, setStatus } from './ui.js';
import { validateRegistration } from './validators.js';

function getElements() {
  return {
    form: document.querySelector('[data-registration-form]'),
    status: document.querySelector('[data-registration-status]'),
    submit: document.querySelector('[data-registration-submit]'),
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

export async function bootstrapRegistroPage() {
  renderNavbar();

  const { form, status, submit } = getElements();
  if (!form) {
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearErrors(form);

    const formData = Object.fromEntries(new FormData(form).entries());
    const validation = validateRegistration(formData);

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
    setStatus(status, 'Registrando estudiante...', 'info');

    try {
      await registerStudent({
        carne: formData.carne,
        estudiante: formData.estudiante,
        correo: formData.correo,
        password: formData.password,
      });

      setStatus(status, 'Registro exitoso. Serás redirigido al inicio de sesión.', 'success');
      setTimeout(() => {
        window.location.href = '/pages/login.html';
      }, 1400);
    } catch (error) {
      setStatus(status, error.message || 'No fue posible registrar al estudiante.', 'danger');
    } finally {
      if (submit) {
        submit.disabled = false;
      }
    }
  });
}

if (typeof document !== 'undefined') {
  const hasRegistrationPage = document.querySelector('[data-registration-page]');
  if (hasRegistrationPage) {
    document.addEventListener('DOMContentLoaded', () => {
      bootstrapRegistroPage();
    });
  }
}
