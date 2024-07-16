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

function displayWeatherForecast(weatherForecast) {
    const forecastContainer = refs.forecastContainer; // Отримуємо посилання на контейнер прогнозів з об'єкта refs
    forecastContainer.innerHTML = '';
    let html = `<h2>Weather Forecast for ${weatherForecast.city.name}</h2>`;

    weatherForecast.forecasts.forEach(day => {
        html += `
            <div class="forecast-day">
                <h3>${day.date}</h3>
        `;

        day.forecasts.forEach(forecast => {
            html += `
                <p>Time: ${forecast.time}</p>
                <p>Temp: ${forecast.temp}°C</p>
                <p>Description: ${forecast.description}</p>
                <img src="http://openweathermap.org/img/wn/${forecast.icon}@2x.png" alt="${forecast.description}" />
            `;
        });

        html += `</div>`;
    });

    forecastContainer.innerHTML = html;
}

export { getFiveDayWeatherForecast, displayWeatherForecast };