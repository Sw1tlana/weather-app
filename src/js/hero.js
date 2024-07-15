
import axios from "axios";

const API_KEY = 'a4736bdfbd8c27f40a91e4af0f4f4383';
const PIXABAY_API_KEY = '41802498-7aef04e1b4b4791f33c618bc1';

const refs = {
searchForm: document.getElementById('search-form'),
container: document.querySelector('.container-info-city'),
cityButtons: document.querySelectorAll('.container-button-city button'),
todayBtn: document.querySelector('.btn-today'),
btnDays: document.querySelector('.btn-days')
 
};

let globalWeatherData = null;
let globalCityName = '';

async function getWeatherData(cityName) {
    try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`;
      
        const response = await axios.get(url);
        return response.data;

    } catch (error) {
       throw error;  
  }
};

refs.searchForm.addEventListener('submit', onSubmit);
refs.todayBtn.addEventListener('click', onTodayButtonClick);

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

async function getCityImages(cityName) {
    try {
        const response = await axios.get(`https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${cityName}&image_type=photo`);
            const data = await response.data;
            return data.hits[0]?.webformatURL || null;
    } catch (error) {
        throw error;
    }

}

async function applyBodyBackground(cityName) {
    try {
        const imageUrl = await getCityImages(cityName);
        if (imageUrl) {
            document.body.style.backgroundImage = `url(${imageUrl})`;
            document.body.style.backgroundRepeat = 'no-repeat';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundSize = 'cover';
        }
    } catch (error) {
        throw error;
    }
};

function onTodayButtonClick() {
    if (globalCityName && globalWeatherData) {
        applyBodyBackground(globalCityName);
        displayWeatherData(globalWeatherData);
    }
};

// function onFiveDaysButtonClick() { };





