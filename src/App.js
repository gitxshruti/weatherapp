import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [infoText, setInfoText] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  const apiKey = process.env.REACT_APP_API_KEY;




  const requestApi = async (cityName) => {
    const api = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`;
    fetchData(api);
  };

  const fetchData = async (api) => {
    setIsLoading(true);
    setInfoText('Getting weather details...');
    try {
      const res = await fetch(api);
      const result = await res.json();
      if (result.cod === 200) {
        setWeather(result);
        setIsLoading(false);
        setInfoText('');
      } else {
        setInfoText(`${city} isn't a valid city name`);
        setIsLoading(false);
      }
    } catch (error) {
      setInfoText('Something went wrong, API Error');
      setIsLoading(false);
    }
  };

  const getLocationWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
      alert('Your browser does not support geolocation API');
    }
  };

  const onSuccess = (position) => {
    const { latitude, longitude } = position.coords;
    const api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    fetchData(api);
  };

  const onError = (error) => {
    setInfoText(error.message);
  };

  const handleKeyUp = (e) => {
    if (e.key === 'Enter' && city !== '') {
      requestApi(city);
    }
  };

  const handleBackClick = () => {
    setWeather(null);
  };

  return (
    <div className={`wrapper ${weather ? 'active' : ''}`}>
      <header>
        <i onClick={handleBackClick} className="arrow-back"></i>
        <h2>Weather Now</h2>
      </header>

      {!weather && (
        <div className="input-part">
          <p className={`info-txt ${infoText ? (isLoading ? 'pending' : 'error') : ''}`}>
            {infoText}
          </p>
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyUp={handleKeyUp}
          />
          <button onClick={getLocationWeather}>Get Device Location</button>
        </div>
      )}

      {weather && (
        <WeatherDetails weather={weather} />
      )}
    </div>
  );
};

const WeatherDetails = ({ weather }) => {
  const { name: city, sys: { country }, weather: weatherData, main: { temp, feels_like, humidity } } = weather;
  const { description, id } = weatherData[0];

  const getIconSrc = () => {
    const currentTime = new Date().getTime() / 1000; // current time in seconds since epoch
    const isDaytime = currentTime >= weather.sys.sunrise && currentTime < weather.sys.sunset;
  
    if (id === 800) {
      return isDaytime ? '/icons/sunny.png' : '/icons/clear-night.png'; // Clear weather
    }
    if (id >= 200 && id <= 232) return '/icons/thunderstorm.png'; // Thunderstorm
    if (id >= 600 && id <= 622) return '/icons/snow.png'; // Snow
    if (id >= 701 && id <= 781) return '/icons/mist.png'; // Mist
    if (id >= 801 && id <= 804) return isDaytime ? '/icons/cloud.png' : '/icons/cloud.png'; // Clouds
    if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) return '/icons/rain.png'; // Rain
    return '';
  };
  

  return (
    <div className="weather-part">
      <img src={getIconSrc()} alt="weather icon" />
      <div className="temp">
        <span className="numb">{Math.floor(temp)}</span>
        <span className="deg">°C</span>
      </div>
      <p className="weather">{description}</p>
      <div className="location">
        <i className="fas fa-map-marker-alt"></i>
        <span>{city}, {country}</span>
      </div>
      <div className="bottom-details">
        <div className="column">
          <i className="fas fa-temperature-low"></i>
          <div className="details">
            <p>Feels like</p>
            <span className="temp">
              <span className="numb-2">{Math.floor(feels_like)}</span>
              <span className="deg">°C</span>
            </span>
          </div>
        </div>
        <div className="column humidity">
          <i className="fas fa-water"></i>
          <div className="details">
            <p>Humidity</p>
            <span>{humidity}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;


