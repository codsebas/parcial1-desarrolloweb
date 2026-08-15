import { getCategories, getVideos, getVideosByCategory } from './api.js';
import { clearElement, createCallout, formatDuration, renderNavbar, setLoading, setStatus } from './ui.js';

export function filterVideos(videos, searchTerm) {
  const term = String(searchTerm ?? '').trim().toLowerCase();
  const source = Array.isArray(videos) ? [...videos] : [];

  if (!term) {
    return source;
  }

  return source.filter((video) => {
    const title = String(video?.titulo ?? '').toLowerCase();
    return title.includes(term);
  });
}

const state = {
  allVideos: [],
  categories: [],
  selectedCategory: 'Todos',
  searchTerm: '',
  loading: false,
};

function getElements() {
  return {
    searchInput: document.querySelector('[data-search-input]'),
    categories: document.querySelector('[data-categories]'),
    grid: document.querySelector('[data-catalog-grid]'),
    status: document.querySelector('[data-catalog-status]'),
    loader: document.querySelector('[data-catalog-loader]'),
    summary: document.querySelector('[data-catalog-summary]'),
  };
}

function applyFilters() {
  return filterVideos(state.allVideos, state.searchTerm);
}

function renderCards() {
  const { grid, summary } = getElements();

  if (!grid) {
    return;
  }

  clearElement(grid);

  const visibleVideos = applyFilters();

  if (summary) {
    summary.textContent = `${visibleVideos.length} video${visibleVideos.length === 1 ? '' : 's'} visibles`;
  }

  if (!visibleVideos.length) {
    grid.appendChild(createCallout('No se encontraron videos con tu búsqueda.', 'warning'));
    return;
  }

  for (const video of visibleVideos) {
    const article = document.createElement('article');
    article.className = 'card video-card';

    const poster = document.createElement('img');
    poster.className = 'card-poster';
    poster.src = video.poster || 'https://placehold.co/600x400?text=Sin+imagen';
    poster.alt = video.titulo ? `Póster de ${video.titulo}` : 'Póster del video';
    article.appendChild(poster);

    const body = document.createElement('div');
    body.className = 'card-body';

    const title = document.createElement('h3');
    title.textContent = video.titulo ?? 'Video sin título';

    const description = document.createElement('p');
    description.className = 'muted';
    description.textContent = video.descripcion ?? '';

    const meta = document.createElement('div');
    meta.className = 'card-meta';

    const duration = document.createElement('span');
    duration.textContent = formatDuration(video.duracion);

    const category = document.createElement('span');
    category.textContent = video.categoria ?? 'Sin categoría';

    const likes = document.createElement('span');
    likes.textContent = `${Number(video.likes ?? 0)} me gusta`;

    meta.append(duration, category, likes);

    const actions = document.createElement('div');
    actions.className = 'card-actions';

    const link = document.createElement('a');
    link.className = 'button';
    link.href = `/pages/video.html?id=${encodeURIComponent(video.id)}`;
    link.textContent = 'Ver detalle';
    actions.appendChild(link);

    body.append(title, description, meta, actions);
    article.appendChild(body);
    grid.appendChild(article);
  }
}

function renderCategories() {
  const { categories } = getElements();

  if (!categories) {
    return;
  }

  clearElement(categories);

  const allButton = document.createElement('button');
  allButton.type = 'button';
  allButton.className = `chip ${state.selectedCategory === 'Todos' ? 'chip-active' : ''}`;
  allButton.textContent = 'Todos';
  allButton.addEventListener('click', async () => {
    state.selectedCategory = 'Todos';
    renderCategories();
    await loadVideos();
  });
  categories.appendChild(allButton);

  for (const category of state.categories) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `chip ${state.selectedCategory === category ? 'chip-active' : ''}`;
    button.textContent = category;
    button.addEventListener('click', async () => {
      state.selectedCategory = category;
      renderCategories();
      await loadVideos();
    });
    categories.appendChild(button);
  }
}

async function loadVideos() {
  const { grid, loader, status } = getElements();
  setLoading(loader, true, 'Cargando videos...');
  setStatus(status, '');
  state.loading = true;

  try {
    state.allVideos =
      state.selectedCategory === 'Todos'
        ? await getVideos()
        : await getVideosByCategory(state.selectedCategory);
    renderCards();
  } catch (error) {
    if (grid) {
      clearElement(grid);
      grid.appendChild(createCallout(error.message || 'No fue posible cargar el catálogo.', 'danger'));
    }
    setStatus(status, error.message || 'No fue posible cargar el catálogo.', 'danger');
  } finally {
    state.loading = false;
    setLoading(loader, false);
  }
}

async function loadCategories() {
  try {
    state.categories = await getCategories();
  } catch {
    state.categories = [];
  }
  renderCategories();
}

function bindEvents() {
  const { searchInput } = getElements();

  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      state.searchTerm = event.target.value;
      renderCards();
    });
  }
}

export async function bootstrapCatalogPage() {
  renderNavbar();
  bindEvents();
  await Promise.all([loadCategories(), loadVideos()]);
}
