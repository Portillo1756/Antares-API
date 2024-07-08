const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

// API key for weatherstack
const API_KEY = "d4c8eb8011f4ca610d1b753b6c442c51";

const createWeatherCard = (cityName, weatherItem, index) => {
    if(index === 0) {
        return `<div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h4>Temperature: ${(weatherItem.main.temp - 273.15)}F</h4>
                    <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                    <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                </div>
                <div class="icon">
                        <img src="http://dataservice.accuweather.com/imagery/v1/maps/radsat/${weatherItem.weather[0].icon}" alt="weather-icon">
                        <h4>${weatherItem.weather[0].description}</h4>
                </div>`;
    } else {
         return ` <li class="card">
            <h3>(${weatherItem.dt_txt.split("")[0]})</h3>
            <img src="http://dataservice.accuweather.com/imagery/v1/maps/radsat/${weatherItem.weather[0].icon}" alt="weather-icon">
            <h4>Temp: ${(weatherItem.main.temp - 273.15)}F</h4>
            <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
            <h4>Humidity: ${weatherItem.main.humidity}%</h4>
            </li>`;
    }
} 

const  getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        console.log(data);

        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastData = new Date(forecast.dt_txt).getDate();
            console.log(fiveDaysForecast)
            if (!uniqueForecastDays.includes(forecastData)) {
               return uniqueForecastDays.push(forecastData);
            }
        });

            // earasing previous weather data
        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";
        
        
        fiveDaysForecast.forEach((weatherItem, index) => {
            if(index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            } else{
                weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            }
        }).catch(() => {
            alert("an error occurred while fetching the weather forecast!");
        });

    });
}

    const getCityCoordinates = () => {
        const cityName = cityInput.value.trim(); //get city name and remove extra space
            if(!cityName) return; 
            const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
                // get city coordinates (latitude, longitude, and name) from API
            fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
            if(!data.lenght) return alert(`no coordinates found for ${cityName}`);
            const { name, lat, lon } = data[0];
            getWeatherDetails(name, lat, lon);
            }).catch(() => {
            alert("an error occurred while fetching the coordinates!");
        });
    }

    const getUserCoordinates = () => {
        navigator.geolocation.getCurrentPosition(
            position => {

            // get coordinates of user location
            const {latitude, longitude} = position.coords;
            console.log(latitude)
            console.log(longitude)
            const REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;

            // get city name from coordinates using reserve geocoding API
            fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data => {
                const {name} = data[0];
                console.log(name)
                getWeatherDetails(name, latitude, longitude);
           }).catch(() => {
                  alert("an error occurred while fetching the city!");
           });
        },
        error => {
            if(error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied.")
            };
        }
    );
}

locationButton.addEventListener("click", getUserCoordinates);
searchButton.addEventListener("click", getCityCoordinates);
// cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates);