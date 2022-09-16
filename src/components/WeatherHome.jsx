import React, { useState } from "react";
import { useCallback } from "react";
import { useEffect } from "react";
const apiKey = "DG9Jed99IetFkzkfpLX3CV5qz9lZca27";
let searchCityKey = `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&offset=1&q=`;
let weatherConditionApi =
  "https://dataservice.accuweather.com/forecasts/v1/daily/5day";
function WeatherHome() {
  const [city, setCity] = useState("");
  const [cityCode, setCityCode] = useState("");
  const [weatherDetails, setWeatherDetails] = useState({
    weatherHeadline: "",
    forecast: [],
  });

  const getCity = useCallback(() => {
    //   let currentSelectedCity = e.target.value;
    // console.log("selected", currentSelectedCity);
    // console.log("city value in state: ", city);
    fetch(searchCityKey + city)
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((responseData) => {
        console.log(responseData);
        setCity(responseData[0].EnglishName);
        setCityCode(responseData[0].Key);
      });
    // .then((cityData) => {
    //   getWeatherDetails(cityData);
    // });
  }, [city]);

  const getWeatherDetails = useCallback(
    (cityCode) => {
      if (cityCode) {
        const currentConditionsApiQueryParam = `/${cityCode}?apikey=${apiKey}&metric=true`;
        fetch(weatherConditionApi + currentConditionsApiQueryParam)
          .then((response) => {
            return response.json();
          })
          .then((responseData) => {
            console.log("conditions response data", responseData);
            // setWeatherDetails({
            //   ...weatherDetails,
            //   forecast: responseData.DailyForecasts,
            //   headline: responseData.Headline.Text,
            // });
            setWeatherDetails((weatherDetails) => {
              return {
                ...weatherDetails,
                forecast: responseData.DailyForecasts,
                headline: responseData.Headline.Text,
              };
            });
          });
      }
    },
    []
  );

  const getWeekDay = (locale, date) => {
    let weekDay = new Date(date).toLocaleDateString(locale, {
      weekday: "long",
    });
    return weekDay;
  };

  useEffect(() => {
    getWeatherDetails(cityCode);
  }, [cityCode,getWeatherDetails]);

  return (
    <div className="home">
      <div>
        <select
          className="selectCity"
          onChange={(e) => {
            setCity(e.target.value);
            getCity();
          }}
        >
          <option value="">Select City To Get The Weather</option>
          <option value="mumbai">Mumbai</option>
          <option value="thane">Thane</option>
          <option value="delhi">New Delhi</option>
          <option value="kolkata">Kolkata</option>
          <option value="bangalore">Bangalore</option>
        </select>
        {city && (
          <div className="cityCondition">
            <h3>{city}</h3>
            {weatherDetails.headline && <p>{weatherDetails.headline}</p>}
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

export default React.memo(WeatherHome);
