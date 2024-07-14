
import axios from "axios";

const API_KEY = 'a4736bdfbd8c27f40a91e4af0f4f4383';

const getWeatherData = async (cityName) => {
    try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`;
      
        const response = await axios.get(url);
        return response.data;

    } catch (error) {
       throw error;  
  }
}

getWeatherData(cityName);