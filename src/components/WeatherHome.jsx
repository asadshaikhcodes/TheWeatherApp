import React, { useState } from "react";
import { useEffect } from "react";
const apiKey = "xmdbXNM8hpqQsqyWEUDQ61CuJEb1YKAc";
let searchCityKey = `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&offset=1&q=`;
let weatherConditionApi =
  "https://dataservice.accuweather.com/forecasts/v1/daily/5day";
function WeatherHome() {
  const [weatherDetails, setWeatherDetails] = useState({
    cityName: "",
    headline: "",
    forecast: [],
  });
  const getCity = async (e) => {
    console.log("selected", e.target.value);
    let city = e.target.value;
    fetch(searchCityKey + city)
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((responseData) => {
        console.log(responseData);
        return {
          key: responseData[0].Key,
          cityName: responseData[0].EnglishName,
        };
      })
      .then((cityData) => {
        getWeatherDetails(cityData);
      });
  };

  const getWeatherDetails = (cityData) => {
    const currentConditionsApiQueryParam = `/${cityData.key}?apikey=${apiKey}&metric=true`;
    console.log("weather condition api", weatherConditionApi);
    fetch(weatherConditionApi + currentConditionsApiQueryParam)
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        console.log("conditions response data", responseData);
        setWeatherDetails({
          ...weatherDetails,
          cityName: cityData.cityName,
          forecast: responseData.DailyForecasts,
          headline: responseData.Headline.Text,
        });
      });
  };

  const getWeekDay = (locale, date) => {
    let weekDay = new Date(date).toLocaleDateString(locale, {
      weekday: "long",
    });
    return weekDay;
  };

  //   useEffect(() => {
  //     console.log("no effect");
  //   });

  return (
    <div className="home">
      <div>
        <select className="selectCity" onChange={getCity}>
          <option value="">Select City To Get The Weather</option>
          <option value="mumbai">Mumbai</option>
          <option value="thane">Thane</option>
          <option value="delhi">New Delhi</option>
          <option value="kolkata">Kolkata</option>
          <option value="bangalore">Bangalore</option>
        </select>
        {weatherDetails.cityName && (
          <div className="cityCondition">
            <h3>{weatherDetails.cityName}</h3>
            <p>{weatherDetails.headline}</p>
          </div>
        )}
        {weatherDetails.forecast && weatherDetails.forecast.length > 0 && (
          <ul style={{ listStyle: "none", padding: "15px", margin: "0" }}>
            <h4 style={{ margin: "10px auto 15px 0px", width: "max-content" }}>
              Next 5 Days
            </h4>
            {weatherDetails.forecast.map((forecast) => {
              return (
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "15px",
                  }}
                  key={forecast.Date}
                >
                  <div style={{ width: "60px", textAlign: "left" }}>
                    {getWeekDay("en-US", forecast.Date)}
                  </div>
                  <div style={{ width: "60px", textAlign: "left" }}>
                    Max: {forecast.Temperature.Maximum.Value}
                    <span>&deg;C</span>
                  </div>
                  <div style={{ width: "60px", textAlign: "left" }}>
                    Min: {forecast.Temperature.Minimum.Value}
                    <span>&deg;C</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default WeatherHome;
