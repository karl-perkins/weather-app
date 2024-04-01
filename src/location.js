const API_KEY = 'fb3d9117fe114f65a0920703243003';
const API_URL = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}`;

// Initialise locations to 
const locations = !localStorage.getItem('locations')
  ? localStorage.setItem('locations', JSON.stringify([]))
  : JSON.parse(localStorage.getItem('locations'));

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

export function getLocations() {
  return locations;
}

export async function addLocation(name) {
  const newLocation = await getWeatherByLocation(name).then((results) =>
    parseResults(results),
  );

  const locationIndex = locations.findIndex((l) => l.name === newLocation.name);

  if (locationIndex === -1) {
    locations.push(newLocation);
    localStorage.setItem('locations', JSON.stringify(locations));
  } else {
    console.log('Location already added. Please update.');
  }
}

export function updateLocations() {
  locations.map(async (location) => {
    const newLocation = await getWeatherByLocation(location.name).then(
      (results) => parseResults(results),
    );
    return newLocation;
  });

  localStorage.setItem('locations', JSON.stringify(locations));
}
