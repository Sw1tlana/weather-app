
import axios from "axios";

const API_KEY = 'a4736bdfbd8c27f40a91e4af0f4f4383';
const PIXABAY_API_KEY = '41802498-7aef04e1b4b4791f33c618bc1';

const refs = {
searchForm: document.getElementById('search-form'),
container: document.querySelector('.container-info-city'),
containerDaysInfo: document.querySelector('.container-info-days'),
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
        globalWeatherData = response.data;
        globalCityName = cityName;
        return response.data;

    } catch (error) {
       throw error;  
  }
};

async function getTodayWeatherData(cityName) {
    const weatherData = await getWeatherData(cityName);
    const today = new Date().toISOString().split('T')[0];

    const todayWeather = weatherData.list.filter(item => item.dt_txt.includes(today));
    if (todayWeather.length > 0) {
        return {
            ...weatherData,
            list: todayWeather
        };
    } else {
        throw new Error('No weather data available for today');
    }
}

refs.searchForm.addEventListener('submit', onSubmit);
refs.todayBtn.addEventListener('click', onTodayButtonClick);

async function onSubmit(evt) {
    evt.preventDefault();
    const cityName = evt.target.search.value.trim();

    if (cityName) {
        try {
            const weatherData = await getWeatherData(cityName);
            applyBodyBackground(cityName);
            if (weatherData && weatherData.list && weatherData.list.length > 0) {
                displayWeatherData(weatherData);
                displayWeatherDataInfo(weatherData);
            } else {
                console.error('No weather data available or list is empty.');
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    }
}; 


function displayWeatherData(data) {
    const firstWeatherItem = data.list[0];

    const iconUrl = `https://openweathermap.org/img/wn/${firstWeatherItem.weather[0].icon}.png`;

    const currentTemp = Math.round(firstWeatherItem.main.temp);
    const minTemp = Math.round(firstWeatherItem.main.temp_min);
    const maxTemp = Math.round(firstWeatherItem.main.temp_max);

    refs.container.innerHTML = `
    <img src="${iconUrl}" alt="${firstWeatherItem.weather[0].description}">
        <h2>${data.city.name}, ${data.city.country}</h2>
        <div>
            <p>${currentTemp}</p>
            <p>Min ${minTemp}°</p>
            <p>Max ${maxTemp}°</p>
        </div>
    `;

};


function displayWeatherDataInfo(data) {
    refs.containerDaysInfo.innerHTML = '';

    if (data && data.list && data.list.length > 0 && data.daily && data.daily.length > 0) {
        const item = data.list[0];

        const itemDate = new Date(item.dt_txt);
        const day = itemDate.getDate();
        const month = itemDate.toLocaleString('default', { month: 'long' });

        const formattedHours = String(itemDate.getHours()).padStart(2, '0');
        const formattedMinutes = String(itemDate.getMinutes()).padStart(2, '0');
        const formattedSeconds = String(itemDate.getSeconds()).padStart(2, '0');

        const sunriseDate = new Date(data.daily[0].sunrise * 1000);
        const sunriseHours = String(sunriseDate.getHours()).padStart(2, '0');
        const sunriseMinutes = String(sunriseDate.getMinutes()).padStart(2, '0');
        
        // Handling timezone offset
        const sunriseOffset = sunriseDate.getTimezoneOffset() / 60; // in hours
        sunriseDate.setHours(sunriseDate.getHours() + sunriseOffset);

        const sunsetDate = new Date(data.daily[0].sunset * 1000);
        const sunsetHours = String(sunsetDate.getHours()).padStart(2, '0');
        const sunsetMinutes = String(sunsetDate.getMinutes()).padStart(2, '0');

        // Handling timezone offset
        const sunsetOffset = sunsetDate.getTimezoneOffset() / 60; // in hours
        sunsetDate.setHours(sunsetDate.getHours() + sunsetOffset);

        const dayInfoHTML = `
            <div class="day-info">
                <h3>${day}th ${month} ${formattedHours}:${formattedMinutes}:${formattedSeconds}</h3>
                <p>Sunrise ${sunriseHours}:${sunriseMinutes}</p>
                <p>Sunset ${sunsetHours}:${sunsetMinutes}</p>
            </div>
        `;

        refs.containerDaysInfo.innerHTML = dayInfoHTML;
    } else {
        console.error('No valid weather data available or data structure is incorrect.', data);
        refs.containerDaysInfo.innerHTML = '<p>No valid weather data available.</p>';
    }
}  


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

async function onTodayButtonClick() {
    if (globalCityName) {

        try {
            const todayWeatherData = await getTodayWeatherData(globalCityName);
            applyBodyBackground(globalCityName);
            displayWeatherData(todayWeatherData); 
            displayWeatherDataInfo(todayWeatherData);
        } catch (error) {
            throw error;
        }
        
    }
};

// async function onDaysButtonClick() {
//     if (globalCityName && globalWeatherData) {
//         try {
//             applyBodyBackground(globalCityName);
//             displayWeatherData(globalWeatherData);
//             displayWeatherDataInfo(globalWeatherData); // Виклик нової функції для відображення в іншому контейнері
//         } catch (error) {
//             console.error(error);
//         }
//     }
// }





