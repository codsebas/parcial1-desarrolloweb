import {
  getCategories,
  getVideoById,
  getVideos,
} from '../script/api.js';

function report(message) {
  process.stdout.write(`${message}\n`);
}

try {
  const videos = await getVideos();
  const categories = await getCategories();

  report(`Videos: ${videos.length}`);
  report(`Categorías: ${categories.length}`);

  if (!videos.length) {
    throw new Error('El catálogo llegó vacío.');
  }

  const firstVideo = videos[0];
  if (!firstVideo?.id) {
    throw new Error('No se pudo identificar el ID del primer video.');
  }

  const detail = await getVideoById(firstVideo.id);
  report(`Detalle cargado: ${detail.titulo ?? 'sin título'} (#${detail.id})`);
  report('Smoke test de API: PASS');
} catch (error) {
  report(`Smoke test de API: FAIL`);
  report(error?.message || String(error));
  process.exitCode = 1;
}
