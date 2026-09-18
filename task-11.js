// Get elements from the HTML page
const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");
const statusMessage = document.getElementById("statusMessage");
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const weatherCondition = document.getElementById("weatherCondition");
const windSpeed = document.getElementById("windSpeed");
const weatherIcon = document.getElementById("weatherIcon");
// Function to convert weather code into a readable condition
function getWeatherCondition(code) {
    if (code === 0) {
        return "Clear sky";
    }
    if (code === 1 || code === 2 || code === 3) {
        return "Partly cloudy";
    }
    if (code === 45 || code === 48) {
        return "Foggy";
    }
    if (code >= 51 && code <= 67) {
        return "Rainy";
    }
    if (code >= 71 && code <= 77) {
        return "Snowy";
    }
    if (code >= 80 && code <= 82) {
        return "Rain showers";
    }
    if (code >= 95) {
        return "Thunderstorm";
    }
    return "Unknown";
}
// Function to select a suitable weather icon
function getWeatherIcon(code) {
    if (code === 0) {
        return "☀️";
    }
    if (code === 1 || code === 2 || code === 3) {
        return "⛅";
    }
    if (code === 45 || code === 48) {
        return "🌫️";
    }
    if (code >= 51 && code <= 67) {
        return "🌧️";
    }
    if (code >= 71 && code <= 77) {
        return "❄️";
    }
    if (code >= 80 && code <= 82) {
        return "🌦️";
    }
    if (code >= 95) {
        return "⛈️";
    }
    return "🌤️";
}
// Function to search for weather
async function searchWeather() {
    const city = cityInput.value.trim();
    // Check whether the user entered a city
    if (city === "") {
        statusMessage.textContent = "Please enter a city name.";
        return;
    }
    statusMessage.textContent = "Loading weather information...";
    try {
        // First, find the location of the city
        const locationResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );
        if (!locationResponse.ok) {
            throw new Error("Unable to find city");
        }
        const locationData = await locationResponse.json();
        // Check whether the city exists
        if (!locationData.results || locationData.results.length === 0) {
            throw new Error("City not found");
        }
        const location = locationData.results[0];
        // Get latitude and longitude
        const latitude = location.latitude;
        const longitude = location.longitude;
        // Get current weather information
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`
        );
        if (!weatherResponse.ok) {
            throw new Error("Unable to get weather information");
        }
        const weatherData = await weatherResponse.json();
        const currentWeather = weatherData.current;
        // Display city name
        cityName.textContent = location.name;
        // Display temperature
        temperature.textContent =
            `${currentWeather.temperature_2m} °C`;
        // Display humidity
        humidity.textContent =
            `${currentWeather.relative_humidity_2m}%`;
        // Display weather condition
        weatherCondition.textContent =
            getWeatherCondition(currentWeather.weather_code);
        // Display wind speed
        windSpeed.textContent =
            `${currentWeather.wind_speed_10m} km/h`;
        // Display weather icon
        weatherIcon.textContent =
            getWeatherIcon(currentWeather.weather_code);
        // Clear loading message
        statusMessage.textContent = "";
    } catch (error) {
        // Display error message
        statusMessage.textContent =
            "City not found. Please check the name and try again.";
        // Reset weather information
        cityName.textContent = "Weather Information";
        temperature.textContent = "-";
        humidity.textContent = "-";
        weatherCondition.textContent = "-";
        windSpeed.textContent = "-";
        weatherIcon.textContent = "☀️";
    }
}
// Search button event
searchButton.addEventListener("click", searchWeather);
// Allow user to press Enter
cityInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        searchWeather();
    }
});