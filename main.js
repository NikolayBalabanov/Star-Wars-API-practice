const cssPromise = {};
export function loadResponse(src) {
  // js module
  if (src.endsWith('.js')) {
    return import(src);
  }
  // css
  if (src.endsWith('.css')) {
    if (!cssPromise[src]) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = src;
      cssPromise[src] = new Promise(resolve => {
        link.addEventListener('load', () => resolve())
      });
      document.head.append(link);
    }
    return cssPromise[src];
  }
  // data
  return fetch(src).then(res => res.json());
};

const appContainer = document.getElementById('app');

const searchParams = new URLSearchParams(location.search);
const filmId = searchParams.get('filmId');

export function renderPage(moduleName, apiURL, css, moreInfo = null) {
  Promise.all([moduleName, apiURL, css].map(src => loadResponse(src)))
    .then(([pageModule, data]) => {
      if (moreInfo) {
        Promise.all([
          new Promise(resolve => {
            Promise.all(data.planets.map(src => loadResponse(src)))
              .then(values => resolve(values))
          }),
          new Promise(resolve => {
            Promise.all(data.species.map(src => loadResponse(src)))
              .then(values => resolve(values))
          }),
          new Promise(resolve => {
            Promise.all(data.characters.map(src => loadResponse(src)))
              .then(values => resolve(values))
          }),
        ]).then(values => {
          appContainer.innerHTML = '';
          appContainer.append(pageModule.render(data, values[0], values[1], values[2]));
        })
      } else {
        appContainer.innerHTML = '';
        appContainer.append(pageModule.render(data));
      }
    });
}

if (filmId) {
  renderPage(
    // загрузка информации о фильме
    './details-page.js',
    `https://swapi.dev/api/films/${filmId}/`,
    'https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css',
    true
  )
} else {
  renderPage(
    // загрузка списка фильмов
    './list-page.js',
    `https://swapi.dev/api/films/`,
    'https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css'
  )
}
// console.log(location)
window.addEventListener('popstate', event => {
  const searchParams = new URLSearchParams(location.search);
  const filmId = searchParams.get('filmId');
  if (filmId) {
    renderPage(
      // загрузка информации о фильме
      './details-page.js',
      `https://swapi.dev/api/films/${filmId}/`,
      'https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css',
      true
    )
  } else {
    renderPage(
      // загрузка списка фильмов
      './list-page.js',
      `https://swapi.dev/api/films/`,
      'https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css'
    )
  }
})
