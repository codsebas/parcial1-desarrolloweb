import test from 'node:test';
import assert from 'node:assert/strict';
import { filterVideos } from '../script/catalog.js';

const videos = [
  { titulo: 'Introduccion a Fetch API' },
  { titulo: 'Maquetacion con CSS Grid' },
  { titulo: 'Bases de Datos' },
];

test('búsqueda exacta', () => {
  const result = filterVideos(videos, 'Bases de Datos');
  assert.equal(result.length, 1);
  assert.equal(result[0].titulo, 'Bases de Datos');
});

test('búsqueda parcial y sin distinguir mayúsculas', () => {
  const result = filterVideos(videos, 'fetch');
  assert.equal(result.length, 1);
  assert.equal(result[0].titulo, 'Introduccion a Fetch API');
});

test('término vacío devuelve todos y no muta el arreglo original', () => {
  const original = [...videos];
  const result = filterVideos(videos, '   ');
  assert.deepEqual(result, original);
  assert.deepEqual(videos, original);
});

test('término sin coincidencias devuelve arreglo vacío', () => {
  const result = filterVideos(videos, 'React');
  assert.deepEqual(result, []);
});
