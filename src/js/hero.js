
import axios from "axios";
import { getFiveDayWeatherForecast, displayWeatherForecast } from './days';

const API_KEY = 'a4736bdfbd8c27f40a91e4af0f4f4383';
const PIXABAY_API_KEY = '41802498-7aef04e1b4b4791f33c618bc1';

const refs = {
searchForm: document.getElementById('search-form'),
container: document.querySelector('.container-info-city'),
containerDaysInfo: document.querySelector('.container-info-days'),
cityButtons: document.querySelectorAll('.container-button-city button'),
todayBtn: document.querySelector('.btn-today'),
btnDays: document.querySelector('.btn-days'),
forecastContainer: document.querySelector('.forecast-container'),
 
};

let globalWeatherData = null;
let globalCityName = '';

async function getWeatherData(cityName) {
    try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`;
      
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
refs.btnDays.addEventListener('click', onDaysButtonClick)

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
                globalCityName = cityName;
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

const formatTime = (timestamp, timezoneOffset) => {
  const date = new Date((timestamp + timezoneOffset) * 1000);
  return date.toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (timestamp, timezoneOffset) => {
  const date = new Date((timestamp + timezoneOffset) * 1000);
  const day = date.getDate();
  const dayOfWeek = date.toLocaleDateString("en-GB", { weekday: 'short' });
  const month = date.toLocaleDateString("en-GB", { month: 'long' });
  const year = date.getFullYear();
  return `${day}th ${dayOfWeek}\n${month} ${year}`;
};

function displayWeatherDataInfo(data) {
  refs.containerDaysInfo.innerHTML = '';

  const item = data.list[0];

  // Отримуємо основні дані з відповіді
  const date = new Date((item.dt + data.city.timezone) * 1000);
  const formattedDate = formatDate(item.dt, data.city.timezone);
  const sunrise = formatTime(data.city.sunrise, data.city.timezone);
  const sunset = formatTime(data.city.sunset, data.city.timezone);

  // Отримуємо час
  const time = date.toLocaleTimeString("en-GB");
  const [formattedHours, formattedMinutes, formattedSeconds] = time.split(':');

  // Форматуємо час сходу та заходу сонця
  const [sunriseHours, sunriseMinutes] = sunrise.split(':');
    const [sunsetHours, sunsetMinutes] = sunset.split(':');
    
      const sunriseIcon = `<svg class="icon-social" width="14.5" height="14.5">
                            <use href="/images/icons-sprite.svg#icon-Sunrise"></use>
                          </svg>`;
      const sunsetIcon = `<svg class="icon-social" width="14.5" height="14.5">
                            <use href="/images/icons-sprite.svg#icon-Sunset"></use>
                         </svg>`;

  const dayInfoHTML = `
    <div class="day-info">
      <h3>${formattedDate}</h3>
      <h3>${formattedHours}:${formattedMinutes}:${formattedSeconds}</h3>
      <p>${sunriseIcon} ${sunriseHours}:${sunriseMinutes} ${sunsetIcon} ${sunsetHours}:${sunsetMinutes}</p>
    </div>
  `;

  refs.containerDaysInfo.innerHTML = dayInfoHTML;
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

async function onDaysButtonClick() {
    try {
        if (globalCityName) {
            const weatherForecast = await getFiveDayWeatherForecast(globalCityName);
            displayWeatherForecast(weatherForecast);
        } else {
            console.error('Global city name not set.');
        }
    } catch (error) {
        console.error('Error fetching weather forecast:', error);
    }
}

export { refs, getWeatherData };




