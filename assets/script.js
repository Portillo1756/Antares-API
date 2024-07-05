const cityInput = document.querySelector(".search-btn");
const searchButton = document.querySelector(".search-btn");

// API key for weatherstack
const API_KEY = "c5fa2674d08fd03ad0df1e3ac2d4b508";

const createWeatherCard = (weatherItem) => {
    return ` <li class="card">
            <h3>(${weatherItem.dt_txt.split("")[0]})</h3>
            <img src="http://dataservice.accuweather.com/imagery/v1/maps/radsat/${weatherItem.weather[0].icon}" alt="weather-icon">
            <h4>Temp: ${(weatherItem.main.temp - 2)}F</h4>
            <h4>Wind: 4.31 M/S</h4>
            <h4>Humidity: 82%</h4>
            </li>`;
} 

const  getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `http://dataservice.accuweather.com/forecasts/v1/daily/10day/{locationKey}`;

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        console.log(data);

        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastData = new Data(forecast.dt_txt).getData();
            if (!uniqueForecastDays.includes(forecastData)){
               return uniqueForecastDays.push(forecastData);
            }
        });

        console.log(fiveDaysForecast);
        fiveDaysForecast.forEach(weatherItem => {
            createWeatherCard(weatherItem);
        });
        }).catch(() => {
        alert("an error occurred while fetching the weather forecast!");
    });
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim(); //get city name and remove extra space
    if(!cityName) return; 
    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
   
    // get city coordinates (latitude, longitude, and name) from API
   fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        if(!data.lenght) return alert(`no coordinates fpund for ${cityName}`);
        const { name, lat, lon } = data[0];
        getWeatherDetails(name, lat, lon);
   }).catch(( => {
          alert("an error occurred while fetching the coordinates!");
   }));
}

searchButton.addEventListener("click", getCityCoordinates);