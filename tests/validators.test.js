import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isValidCarne,
  isValidEmail,
  isValidLoginUser,
  isValidPin,
  validateLogin,
  validateRegistration,
} from '../script/validators.js';

test('carné válido', () => {
  assert.equal(isValidCarne('1890-23-12105'), true);
});

test('carné con 4 dígitos en el último segmento es válido', () => {
  assert.equal(isValidCarne('1890-23-1210'), true);
});

test('carnés inválidos', () => {
  for (const value of ['18902312105', '1890-2-12105', '1890-23-121', '1890-23-121055', 'abcd-23-12105', '1890 23 12105']) {
    assert.equal(isValidCarne(value), false);
  }
});

test('pin numérico', () => {
  for (const value of ['1234', '0000', '123456']) {
    assert.equal(isValidPin(value), true);
  }

  for (const value of ['12a4', '12 34', 'abcd']) {
    assert.equal(isValidPin(value), false);
  }
});

test('correo válido y casos inválidos', () => {
  assert.equal(isValidEmail('persona@correo.com'), true);
  assert.equal(isValidEmail('persona.correo.com'), false);
  assert.equal(isValidEmail('persona@correo'), false);
  assert.equal(isValidEmail(''), false);
});

test('usuario de login acepta carné o correo', () => {
  assert.equal(isValidLoginUser('1890-23-12105'), true);
  assert.equal(isValidLoginUser('persona@correo.com'), true);
  assert.equal(isValidLoginUser('texto libre'), false);
});

test('validación de registro', () => {
  const result = validateRegistration({
    carne: '1890-23-12105',
    estudiante: 'Juan Perez',
    correo: 'juan@correo.com',
    password: '1234',
    confirmPassword: '1234',
  });

  assert.equal(result.valid, true);
});

test('validación de login', () => {
  const result = validateLogin({ usuario: '1890-23-12105', password: '1234' });
  assert.equal(result.valid, true);
});
