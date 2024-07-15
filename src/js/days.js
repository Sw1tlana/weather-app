import axios from "axios";

async function getFiveDayWeatherForecast(cityName) {
    try {
        const weatherData = await getWeatherData(cityName);
        const dailyForecasts = {};

        weatherData.list.forEach(item => {
            const date = item.dt_txt.split(' ')[0]; // Extract date from dt_txt
            if (!dailyForecasts[date]) {
                dailyForecasts[date] = {
                    date,
                    forecasts: []
                };
            }
            dailyForecasts[date].forecasts.push({
                time: item.dt_txt.split(' ')[1], // Extract time from dt_txt
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
}