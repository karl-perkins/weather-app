const API_KEY = 'fb3d9117fe114f65a0920703243003';
const API_URL = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}`;

const locations = [];

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

document.querySelector('form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const locationName = formData.get('location');

  const newLocation = await getWeatherByLocation(locationName).then((results) =>
    parseResults(results),
  );

  const locationIndex = locations.findIndex((l) => l.name === newLocation.name);

  if (locationIndex === -1) {
    locations.push(newLocation);

    const locationsElement = document.querySelector('#locations');
    locationsElement.innerHTML = '';

    locations.forEach((location) => {
      renderLocation(location, locationsElement);
    });
  } else {
    console.log('Location already added. Please update.');
  }

  event.target.reset();
});

// const btn = document.querySelector('.toggle');
// const temp = document.querySelector('.temp');
// btn.addEventListener('click', () => {
//   if (btn.textContent === '\u00B0C') {
//     btn.textContent = '\u00B0F';
//     temp.textContent = weather.fahrenheit;
//   } else {
//     btn.textContent = '\u00B0C';
//     temp.textContent = weather.celsius;
//   }
// });
