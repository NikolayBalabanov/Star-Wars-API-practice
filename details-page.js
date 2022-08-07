export function render(data, planets = null, species, characters) {
  const container = document.createElement('div');
  container.classList.add('container', 'py-4')

  container.innerHTML = `
    <h1 class="mb-3">Episode: ${data.title} ${data.episode_id}</h1>
    <p class="lead"><strong>Director:</strong> ${data.director}</p>
    <p class="lead"><strong>Producer:</strong> ${data.producer}</p>
    <p class="lead"><strong>Release date:</strong> ${data.release_date}</p>
    <p class="lead">${data.opening_crawl}</p>
    <h2>Planets</h2>`;

  const backToBtn = document.createElement('a');
  backToBtn.classList.add(
    'btn',
    'btn-primary',
    'mb-3',
  )
  backToBtn.setAttribute('role', 'button')
  backToBtn.textContent = 'Back to episodes';
  backToBtn.href = '#'
  backToBtn.addEventListener('click', async (event) => {
    event.preventDefault()
    const hostPath = location.pathname
    const reload = await import('./main.js');
    reload.renderPage(
      // загрузка списка фильмов
      './list-page.js',
      `https://swapi.dev/api/films/`,
      'https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css'
    )
    history.pushState({page: 'default'}, 'Catalog Page', `${hostPath}`)
  })

  container.prepend(backToBtn)
  // строим список планет
  const planetList = document.createElement('ul');
  planetList.classList.add('list-group', 'mb-3');

  for (const planet of planets) {
    const planetName = document.createElement('li');
    planetName.classList.add('list-group-item');
    planetName.textContent = planet.name;
    planetList.append(planetName);
  }
  container.append(planetList);

  const speciesList = document.createElement('ul');
  speciesList.classList.add('list-group', 'mb-3');

  for (const specie of species) {
    const specieItem = document.createElement('li');
    specieItem.classList.add('list-group-item');
    specieItem.textContent = specie.name;
    speciesList.append(specieItem);
  }
  const speciesTitle = document.createElement('h2');
  speciesTitle.textContent = 'Species';
  speciesTitle.classList.add('mb-3');
  container.append(speciesTitle);
  container.append(speciesList);

  // строим список персонажей
  const charactersList = document.createElement('ul');
  charactersList.classList.add('list-group', 'mb-3');
  for (const char of characters) {
    const character = document.createElement('li');
    character.classList.add('list-group-item');
    character.textContent = char.name;
    charactersList.append(character);
  }
  const charactersTitle = document.createElement('h2');
  charactersTitle.textContent = 'Characters';
  charactersTitle.classList.add('mb-3');
  container.append(charactersTitle);
  container.append(charactersList);

  return container;
}
