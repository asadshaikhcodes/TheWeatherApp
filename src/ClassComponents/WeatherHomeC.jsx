import React, { Component } from "react";
// import ShowDate from "../components/ShowDate";
import ShowDateC from "./ShowDateC";
const apiKey = "0w7vHAjUcqfkFAsCvtwNiAiiqNzrdooT";
let searchCityKey = `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&offset=1&q=`;
let weatherConditionApi =
  "https://dataservice.accuweather.com/forecasts/v1/daily/5day";
let currentConditionsApi =
  "https://dataservice.accuweather.com/currentconditions/v1/";
const weatherIcon = require("../components/cloudy.png");

const getWeekDay = (locale, date) => {
  let weekDay = new Date(date).toLocaleDateString(locale, {
    weekday: "long",
  });
  return weekDay;
};

class WeatherHomeC extends Component {
  constructor(props) {
    super(props);
    //initializing state
    this.state = {
      city: "",
      cityCode: "",
      forecasts: [],
      weatherHeadline: "",
      currentConditions: "",
      gotWeather: true,
    };

    //bind onChange handler to this instance
    this.cityHandleChange = this.cityHandleChange.bind(this);
  }

  //get city name from dropdown list
  cityHandleChange(e) {
    const cityVal = e.target.value;
    this.setState({ gotWeather: false });
    this.getCity(cityVal);
  }

  //get weather forecasts and current condition once cityCode is updated
  componentDidUpdate(previousProps, previousState) {
    console.log("previous state", previousState);
    if (previousState.cityCode !== this.state.cityCode) {
      this.getWeatherDetails(this.state.cityCode);
      this.getCurrentCondition(this.state.cityCode);
    }
  }

  getCity(city) {
    if (city) {
      fetch(searchCityKey + city)
        .then((response) => {
          console.log(response);
          return response.json();
        })
        .then((responseData) => {
          console.log("city response data", responseData);
          this.setState({
            cityCode: responseData[0].Key,
            city: responseData[0].EnglishName,
            gotWeather: true,
          });
        });
    }
  }

  getWeatherDetails(cityCode) {
    const currentConditionsApiQueryParam = `/${cityCode}?apikey=${apiKey}&metric=true`;
    fetch(weatherConditionApi + currentConditionsApiQueryParam)
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        console.log("conditions response data", responseData);
        this.setState({
          forecasts: responseData.DailyForecasts,
          weatherHeadline: responseData.Headline.Text,
        });
      });
  }

  getCurrentCondition(cityCode) {
    if (cityCode) {
      const currentConditionsApiQueryParam = `${cityCode}?apikey=${apiKey}`;
      fetch(currentConditionsApi + currentConditionsApiQueryParam)
        .then((response) => {
          return response.json();
        })
        .then((responseData) => {
          console.log("current conditions response data", responseData);
          this.setState({
            currentConditions: responseData[0].Temperature.Metric.Value,
          });
        });
    }
  }

  render() {
    return (
      <div className="home">
        <div>
          <select className="selectCity" onChange={this.cityHandleChange}>
            <option value="">Select City To Get The Weather</option>
            <option value="mumbai">Mumbai</option>
            <option value="thane">Thane</option>
            <option value="delhi">New Delhi</option>
            <option value="kolkata">Kolkata</option>
            <option value="bangalore">Bangalore</option>
          </select>
          {this.state.city && this.state.currentConditions ? (
            <div className="cityCondition">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3>{this.state.city}</h3>
                <img
                  width="50px"
                  height="50px"
                  src={weatherIcon}
                  alt="weather icon"
                />
              </div>
              <h3
                style={{
                  width: "max-content",
                  textAlign: "left",
                  margin: "0px",
                }}
              >
                {this.state.currentConditions}
                <span>&deg;C</span>
              </h3>
              {this.state.headline && <p>{this.state.headline}</p>}
            </div>
          ) : !this.state.gotWeather ? (
            <h3>Getting weather....</h3>
          ) : (
            <ShowDateC />
          )}
          {this.state.forecasts && this.state.forecasts.length > 0 && (
            <ul style={{ listStyle: "none", padding: "15px", margin: "0" }}>
              <h4
                style={{ margin: "10px auto 15px 0px", width: "max-content" }}
              >
                Next 5 Days
              </h4>
              {this.state.forecasts.map((forecast) => {
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
}

export default WeatherHomeC;
