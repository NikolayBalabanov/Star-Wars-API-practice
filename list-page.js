export function render(data) {
  const container = document.createElement('div');
  container.classList.add(
    'container',
    'justify-content-between',
    'flex-wrap',
    'py-4'
  )
  const header = document.createElement('h1');
  header.textContent = 'The Star Wars episodes Catalog:';

  container.append(header)

  const filmList = document.createElement('div');
  filmList.classList.add('list-group');
  container.append(filmList);

  for (const film of data.results) {
    const filmLink = document.createElement('a');
    filmLink.classList.add(
      'list-group-item',
      'list-group-item-action',
      'list-group-item-success',
      'link'
    );
    filmLink.textContent = film.url[film.url.length - 2] + '. ' + film.title;
    filmLink.href = `?filmId=${film.url[film.url.length - 2]}`;
    filmLink.addEventListener('click', async (event) => {
      event.preventDefault();
      history.pushState(null, '', filmLink.href)
      const reload = await import('./main.js');
      reload.renderPage(
        './details-page.js',
        `https://swapi.dev/api/films/${film.url[film.url.length - 2]}/`,
        'https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css',
        true
      )
    })
    filmList.append(filmLink);
  }
  return container;
}
