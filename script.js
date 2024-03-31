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

document.querySelector('form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const location = formData.get('location');
  const weather = await getWeatherByLocation(location).then((results) => parseResults(results));
  document.querySelector('output').textContent = weather.conditionText;
});