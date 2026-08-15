import { bootstrapCatalogPage } from './catalog.js';

if (typeof document !== 'undefined') {
  const hasCatalogPage = document.querySelector('[data-catalog-page]');
  if (hasCatalogPage) {
    document.addEventListener('DOMContentLoaded', () => {
      bootstrapCatalogPage();
    });
  }
}
