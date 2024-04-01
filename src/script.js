import "./style.css";
import * as Location from './location'

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

function renderLocations(locations) {
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

  await Location.addLocation(locationName);

  renderLocations(Location.getLocations());

  event.target.reset();
});

const updateButton = document.querySelector('.update-btn');
updateButton.addEventListener('click', (event) => {
  Location.updateLocations();
  renderLocations(Location.getLocations());
});

document.addEventListener('DOMContentLoaded', () => {
  renderLocations(Location.getLocations());
});