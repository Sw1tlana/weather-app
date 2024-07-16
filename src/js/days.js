import axios from "axios";
import { refs, getWeatherData } from "./hero";

async function getFiveDayWeatherForecast(cityName) {
    try {
        const weatherData = await getWeatherData(cityName);
        const dailyForecasts = {};

        weatherData.list.forEach(item => {
            const date = item.dt_txt.split(' ')[0]; 
            if (!dailyForecasts[date]) {
                dailyForecasts[date] = {
                    date,
                    forecasts: []
                };
            }
            dailyForecasts[date].forecasts.push({
                time: item.dt_txt.split(' ')[1],
                temp: item.main.temp,
                description: item.weather[0].description,
                icon: item.weather[0].icon
            });
        });

        return {
            city: weatherData.city,
            forecasts: Object.values(dailyForecasts)
        };
    } catch (error) {
        throw error;
    }
};

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'long', day: '2-digit', month: 'short' };
    return date.toLocaleDateString('en-US', options);
}

function displayWeatherForecast(weatherForecast) {
    const forecastContainer = refs.forecastContainer;
    forecastContainer.innerHTML = '';
    
    let html = `<h2>${weatherForecast.city.name}</h2>`;

    if (weatherForecast.list && weatherForecast.list.length > 0) {
        weatherForecast.list.forEach(day => {
            const formattedDate = formatDate(day.date);
            
            html += `
                <div class="forecast-day">
                    <h3>${weatherForecast.city.name}, ${weatherForecast.city.country}</h3>
                    <h4>${formatDate(day.date)}</h4>
                    <p>${formattedDate}</p>
                    <div class="temp-range">
                        <span>Min: ${day.minTemp}°</span>
                        <span>Max: ${day.maxTemp}°</span>
                    </div>
                    <button class="more-info-btn" data-date="${day.date}">More Info</button>
                    <div id="more-info-${day.date}" class="more-info" style="display: none;">
            `;
            
            day.forecasts.forEach(forecast => {
                html += `
                    <div class="forecast-detail">
                        <p>Time: ${forecast.time}</p>
                        <p>Temp: ${forecast.temp}°C</p>
                        <p>Description: ${forecast.description}</p>
                        <img src="https://openweathermap.org/img/wn/${forecast.icon}@2x.png" 
                             alt="${forecast.description}" />
                    </div>
                `;
            });
            
            html += `</div></div>`;
        });
    } else {
        html += '<p>No forecast data available.</p>';
    }

    forecastContainer.innerHTML = html;

    // Додаємо обробники подій для кнопок "More Info"
    const moreInfoButtons = document.querySelectorAll('.more-info-btn');
    moreInfoButtons.forEach(button => {
        button.addEventListener('click', function() {
            const date = button.getAttribute('data-date');
            toggleMoreInfo(date);
        });
    });
}

function toggleMoreInfo(date) {
    const moreInfoDiv = document.getElementById(`more-info-${date}`);
    if (moreInfoDiv) {
        moreInfoDiv.style.display = moreInfoDiv.style.display === 'none' ? 'block' : 'none';
    }
}

export { getFiveDayWeatherForecast, displayWeatherForecast };