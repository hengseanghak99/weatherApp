import React, { useState } from "react";
import moment from "moment-timezone";
import axios from "axios";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import "./App.css";

countries.registerLocale(en);

const App = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [air, setAir] = useState(null);
  const [error, setError] = useState("");

  const apiKey = process.env.REACT_APP_API_KEY;

  const getAirQuality = (qualityIndex) => {
    if (qualityIndex === 1) {
      return "Good";
    } else if (qualityIndex === 2) {
      return "Fair";
    } else if (qualityIndex === 3) {
      return "Moderate";
    } else if (qualityIndex === 4) {
      return "Poor";
    } else if (qualityIndex === 5) {
      return "Very Poor";
    } else {
      return "Unknown";
    }
  };

  const getWeather = async (city) => {
    try {
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      const airResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${weatherResponse.data.coord.lat}&lon=${weatherResponse.data.coord.lon}&appid=${apiKey}`
      );

      if (weatherResponse.data.cod !== 200) {
        setError(weatherResponse.data.message);
        setWeather(null);
        setAir(null);
      } else {
        setWeather(weatherResponse.data);
        setAir(airResponse.data);
        setError("");
      }
    } catch (err) {
      setError("Failed to fetch data");
    }
  };

  const handleSearch = () => {
    if (city) {
      getWeather(city);
    }
  };

  let airQuality = "Unknown";
  if (air && air.list && air.list.length > 0) {
    airQuality = getAirQuality(air.list[0].main.aqi);
  }

  return (
    <div className="App">
      <h1>Weather App</h1>
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      {error && <p>{error}</p>}
      {weather && (
        <div>
          <h2>
            {weather.name}, {countries.getName(weather.sys.country, 'en')}
          </h2>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
            alt="weather-icon"
          />
          <p>Air quality: {airQuality} </p>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Weather: {weather.weather[0].description}</p>
          <p>Wind Speed: {weather.wind.speed}</p>
          <p>
            Current time:{" "}
            {moment()
              .utcOffset(weather.timezone / 60)
              .format("DD-MM-YYYY HH:mm:ss")}
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
