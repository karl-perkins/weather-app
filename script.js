const API_KEY = 'fb3d9117fe114f65a0920703243003';
const API_URL = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}`;

const weatherList = [];

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
    location: results.location.name,
    country: results.location.country,
    celsius: results.current.temp_c,
    fahrenheit: results.current.temp_f,
    conditionText: results.current.condition.text,
    conditionIcon: results.current.condition.icon,
  };
}

function renderWeather() {
  const weatherListElement = document.querySelector('#weather-list');
  weatherListElement.innerHTML = '';

  weatherList.forEach((weather) => {
    const weatherItem = document.createElement('div');
    weatherItem.classList.add('weather');
  
    const location = document.createElement('div');
    location.classList.add('location')
    location.textContent = `${weather.location}, ${weather.country}`;
  
    const icon = document.createElement('img');
    icon.classList.add('icon')
    icon.src = weather.conditionIcon;
  
    const condition = document.createElement('div');
    condition.classList.add('condition')
    condition.textContent = weather.conditionText;
  
    const temperature = document.createElement('div');
    temperature.classList.add('temperature')
    temperature.textContent = `${weather.celsius} \u00B0C`;
  
    weatherItem.appendChild(location);
    weatherItem.appendChild(icon);
    weatherItem.appendChild(condition);
    weatherItem.appendChild(temperature);
  
    weatherListElement.appendChild(weatherItem);
  });
}

document.querySelector('form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const location = formData.get('location');
  
  const weather = await getWeatherByLocation(location).then((results) =>
    parseResults(results),
  );

  weatherList.push(weather);

  renderWeather();
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