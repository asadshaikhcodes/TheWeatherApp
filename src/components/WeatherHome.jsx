import React, { useState } from "react";
import { useEffect } from "react";
const apiKey = "8gLHFi69zcHoGFk4VN4eAbNqbCsSBIwv";
let searchCityKey = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&offset=1&q=`;
let weatherConditionApi =
  "http://dataservice.accuweather.com/forecasts/v1/daily/5day";
function WeatherHome() {
  const [weatherDetails, setWeatherDetails] = useState({
    cityName: "",
    forecast: [],
  });
  const getCity = async (e) => {
    // console.log("selected", e.target.value);
    let city = e.target.value;
    fetch(searchCityKey + city)
      .then((response) => {
        // console.log(response);
        return response.json();
      })
      .then((responseData) => {
        // console.log(responseData);
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
    weatherConditionApi += currentConditionsApiQueryParam;
    fetch(weatherConditionApi)
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        // console.log("conditions response data", responseData);
        setWeatherDetails({
          ...weatherDetails,
          cityName: cityData.cityName,
          forecast: responseData.DailyForecasts,
        });
      });
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
          </div>
        )}
        {weatherDetails.forecast && weatherDetails.forecast.length > 0 && (
          <ul style={{ listStyle: "none", padding: "15px" }}>
            <h4>Next 5 Days</h4>
            {weatherDetails.forecast.map((forecast) => {
              return (
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>{new Date(forecast.Date).toLocaleDateString()}</div>
                  <div>Max: {forecast.Temperature.Maximum.Value}C</div>
                  <div>Min: {forecast.Temperature.Minimum.Value}C</div>
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
