import {useEffect, useState} from "react";
import axios from "axios";
export const Country = ({country}) => {
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=
  ${country.capital}&appid=${process.env.REACT_APP_API_KEY}&units=metric`
  const [weatherData, setWeatherData] = useState({})
  const fetchWeatherData = () => {
    axios.get(weatherURL).then(response => setWeatherData(response.data))
  }
  useEffect(fetchWeatherData, [weatherURL])
  return(
      <div>
        <h1> {country.name.common} </h1>
        <p> capital {country.capital}</p>
        <p> area {country.area}</p>
        <h3> languages: </h3>
        {
          <ul>
            {
              Object.entries(country.languages).map(([langCode, language]) =>
                  <li key={langCode}> {language} </li>)
            }
          </ul>
        }
        <img src={country.flags.png} alt={`${country.name.common} flag`} height="100px"/>
        {
            Object.keys(weatherData).length > 0 && <div>
              <h2>Weather in {country.capital}</h2>
              <p> temperature {weatherData.main.temp} Celcius </p>
              <img src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                   alt={`${weatherData.weather[0].description} icon`} />
              <p> wind {weatherData.wind.speed} m/s </p>
            </div>
        }
      </div>
  )
}