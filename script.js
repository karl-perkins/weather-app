const API_KEY = 'fb3d9117fe114f65a0920703243003';
const API_URL = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}`;

let locations = [];

async function getWeatherByLocation(location) {
  const response = await fetch(`${API_URL}&q=${location}`);
  if (response.ok) {
    const results = await response.json();
    return results;
  }
  throw new Error('Invalid response received.');
}

function parseResults(results) {
  return {
    name: results.location.name,
    country: results.location.country,
    celsius: results.current.temp_c,
    fahrenheit: results.current.temp_f,
    conditionText: results.current.condition.text,
    conditionIcon: results.current.condition.icon,
  };
}

function renderLocation(location, locationsElement) {
  const locationElement = document.createElement('div');
  locationElement.classList.add('location');

  const name = document.createElement('div');
  name.classList.add('location');
  name.textContent = `${location.name}, ${location.country}`;
  locationElement.appendChild(name);

  const icon = document.createElement('img');
  icon.classList.add('icon');
  icon.src = location.conditionIcon;
  locationElement.appendChild(icon);

  const condition = document.createElement('div');
  condition.classList.add('condition');
  condition.textContent = location.conditionText;
  locationElement.appendChild(condition);

  const temperature = document.createElement('div');
  temperature.classList.add('temperature');
  temperature.textContent = `${location.celsius} \u00B0C`;
  locationElement.appendChild(temperature);

  locationsElement.appendChild(locationElement);
}

function renderLocations() {
  const locationsElement = document.querySelector('#locations');
  locationsElement.innerHTML = '';

  locations.forEach((location) => {
    renderLocation(location, locationsElement);
  });
}

const addLocationForm = document.querySelector('form');
addLocationForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const locationName = formData.get('location');

  const newLocation = await getWeatherByLocation(locationName).then((results) =>
    parseResults(results),
  );

  const locationIndex = locations.findIndex((l) => l.name === newLocation.name);

  if (locationIndex === -1) {
    locations.push(newLocation);
    localStorage.setItem('locations', JSON.stringify(locations));
    renderLocations();
  } else {
    console.log('Location already added. Please update.');
  }

  event.target.reset();
});

const updateButton = document.querySelector('.update-btn');
updateButton.addEventListener('click', async (event) => {
  locations.map(async (location) => {
    const newLocation = await getWeatherByLocation(location.name).then(
      (results) => parseResults(results),
    );
    return newLocation;
  });

  localStorage.setItem('locations', JSON.stringify(locations));

  renderLocations();
});


document.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('locations')) {
    localStorage.setItem('locations', JSON.stringify([]));
  } else {
    locations = JSON.parse(localStorage.getItem('locations'));
  }
  
  renderLocations();
});