const API_KEY = 'fb3d9117fe114f65a0920703243003';
const API_URL = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}`;

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

let weather = {};
document.querySelector('form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const location = formData.get('location');
  weather = await getWeatherByLocation(location).then((results) =>
    parseResults(results),
  );

  document.querySelector('.condition').textContent = weather.conditionText;
  document.querySelector('.location').textContent =
    `${weather.location}, ${weather.country}`;
  document.querySelector('.icon').src = weather.conditionIcon;
  document.querySelector('.temp').textContent = weather.celsius;
});

const btn = document.querySelector('.toggle');
const temp = document.querySelector('.temp');
btn.addEventListener('click', () => {
  if (btn.textContent === '\u00B0C') {
    btn.textContent = '\u00B0F';
    temp.textContent = weather.fahrenheit;
  } else {
    btn.textContent = '\u00B0C';
    temp.textContent = weather.celsius;
  }
});
