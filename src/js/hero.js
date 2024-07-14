
import axios from "axios";

const API_KEY = 'a4736bdfbd8c27f40a91e4af0f4f4383';

const refs = {
 searchForm: document.getElementById('search-form'),
 container: document.querySelector('.container-info-city'),
 cityButtons: document.querySelectorAll('.container-button-city button'),
};

async function getWeatherData(cityName) {
    try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`;
      
        const response = await axios.get(url);
        return response.data;

    } catch (error) {
       throw error;  
  }
};

refs.searchForm.addEventListener('submit', onSubmit)

async function onSubmit(evt) {
    evt.preventDefault();
    const cityName = evt.target.search.value.trim();

    if (cityName) {
        try {
            const weatherData = await getWeatherData(cityName);
            applyBodyBackground(cityName);
            displayWeatherData(weatherData);
        } catch (error) {
            throw error;
        }
    }
};

function displayWeatherData(data) {
    const firstWeatherItem = data.list[0];

    const iconUrl = `https://openweathermap.org/img/wn/${firstWeatherItem.weather[0].icon}.png`;

    const currentTemp = Math.round(firstWeatherItem.main.temp);
    const minTemp = Math.round(firstWeatherItem.main.temp_min);
    const maxTemp = Math.round(firstWeatherItem.main.temp_max)

    refs.container.innerHTML = `
    <img src="${iconUrl}" alt="${firstWeatherItem.weather[0].description}">
        <h2>${data.city.name}, ${data.city.country}</h2>
        <div>
            <p>${currentTemp}</p>
            <p>Min ${minTemp}</p>
            <p>Max ${maxTemp}</p>
        </div>
    `;
};

function applyBodyBackground(cityName) {
    const imageUrl = `https://openweathermap.org/images/${cityName.toLowerCase()}_background.jpg`; 
    document.body.style.backgroundImage = `url(${imageUrl})`;
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundSize = 'cover';
};

// cityButtons.array.forEach(button => {
//     button.addEventListener('click', changesCityButton);
// });

// async function changesCityButton(event) {
//     const button = event.currentTarget;
//     const cityName = button.textContent;

//     try {

//         const weatherData = await getWeatherData(cityName);
//         displayWeatherData(weatherData);
//         applyBodyBackground(cityName);

//     } catch (error) {
//         throw error;
//     }
        
// }

