export function isValidCarne(value) {
  return /^\d{4}-\d{2}-\d{5}$/.test(String(value ?? '').trim());
}

export function isValidEmail(value) {
  const email = String(value ?? '').trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPin(value) {
  return /^\d+$/.test(String(value ?? '').trim());
}

export function isValidLoginUser(value) {
  const user = String(value ?? '').trim();
  return isValidCarne(user) || isValidEmail(user);
}

export function validateRegistration(formData) {
  const errors = {};
  const carne = String(formData.carne ?? '').trim();
  const estudiante = String(formData.estudiante ?? '').trim();
  const correo = String(formData.correo ?? '').trim();
  const password = String(formData.password ?? '').trim();
  const confirmPassword = String(formData.confirmPassword ?? '').trim();

  if (!isValidCarne(carne)) {
    errors.carne = 'El carné debe tener el formato 0000-00-00000.';
  }

  if (!estudiante) {
    errors.estudiante = 'Ingresa el nombre del estudiante.';
  }

  if (!isValidEmail(correo)) {
    errors.correo = 'Ingresa un correo válido.';
  }

  if (!isValidPin(password)) {
    errors.password = 'El PIN debe contener solo números.';
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = 'La confirmación del PIN no coincide.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateLogin(formData) {
  const errors = {};
  const usuario = String(formData.usuario ?? '').trim();
  const password = String(formData.password ?? '').trim();

  if (!isValidLoginUser(usuario)) {
    errors.usuario = 'Ingresa un carné válido o un correo válido.';
  }

  if (!isValidPin(password)) {
    errors.password = 'El PIN debe contener solo números.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
