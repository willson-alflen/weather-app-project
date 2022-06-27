// get elements from the DOM
const weatherApp = document.querySelector(".weather-app");
const temp = document.querySelector(".temp");
const dateOutput = document.querySelector(".date");
const timeOutput = document.querySelector(".time");
const conditionOutput = document.querySelector(".condition");
const nameOutput = document.querySelector(".name");
const icon = document.querySelector(".icon");
const cloudOutput = document.querySelector(".cloud");
const humidityOutput = document.querySelector(".humidity");
const windOutput = document.querySelector(".wind");
const form = document.querySelector("#locationInput");
const search = document.querySelector(".search");
const submitBtn = document.querySelector(".submit");
const cities = document.querySelectorAll(".city");

// default city when the page loads up
let cityInput = "Chapecó";

// add click event to each city in the panel
cities.forEach((city) => {
  city.addEventListener("click", (e) => {
    // change from default city to the clicked one
    cityInput = e.target.innerHTML;

    // function that fetches and displays all the data from the Weather API
    fetchWeatherData();

    // fade out the app (animation)
    weatherApp.style.opacity = "0";
  });
});

// add submit event to the form
form.addEventListener("submit", (e) => {
  // prevents the default behaviour of the form
  e.preventDefault();

  // if the search bar is empty, throw an alert
  if (search.value.length == 0) {
    alert("Please type in a city");
  } else {
    // change from default city to the one written in the input field
    cityInput = search.value;

    // function that fetches and displays all the data from the Weather API
    fetchWeatherData();

    // remove all text from the input field
    search.value = "";

    // fade out the app (animation)
    weatherApp.style.opacity = "0";
  }
});

// function that returns a day of the week from a date (MM DD YYYY)
function dayOfTheWeek(day, month, year) {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  // console.log(weekday[new Date(`${year}/${month}/${day}`).getDay()]);
  return weekday[new Date(`${year}/${month}/${day}`).getDay()];
}

// function that fetches and displays all the data from the Weather API
function fetchWeatherData() {
  // weather api key
  let myKey = "95e9114a1a1d485da4194524220406";

  // fetch the data and dynamicaly add the city name with template literals
  fetch(
    `https://api.weatherapi.com/v1/current.json?key=${myKey}&q=${cityInput}`
  )
    // convert the data from a JSON format to a regular JS object
    .then((response) => response.json())
    .then((data) => {
      // add temperature and weather condition to the page
      temp.innerHTML = data.current.temp_c + "&#176;";
      conditionOutput.innerHTML = data.current.condition.text;

      // get the date and time from the city and extract day, month, year and time into individual variables
      const date = data.location.localtime;
      const y = parseInt(date.substr(0, 4));
      const m = parseInt(date.substr(5, 2));
      const d = parseInt(date.substr(8, 2));
      const time = date.substr(11, 5);

      // reformat the date into something more appealing and add it to the page
      // original format: 2021-10-09 17:53
      // new format: 17:53 - Friday 9, 10 2021
      dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${d}/${m}/${y}`;
      timeOutput.innerHTML = time;

      // add the name of the city into the page
      nameOutput.innerHTML = data.location.name;

      // get the corresponding icon url for the weather and extract a part of it
      const iconID = data.current.condition.icon.substr(
        "//cdn.weatherapi.com/weather/64x64/".length
      );

      // reformat the icon url to your own local folder path and add it to the page
      icon.src = "./assets/icons/" + iconID;

      // add the weather details to the page
      cloudOutput.innerHTML = data.current.cloud + "%";
      humidityOutput.innerHTML = data.current.humidity + "%";
      windOutput.innerHTML = data.current.wind_kph + "km/h";

      // set default time of the day
      let timeOfDay = "day";

      // get the unique id for each weather condition
      const code = data.current.condition.code;

      // change to night if its night time in the city
      if (!data.current.is_day) {
        timeOfDay = "night";
      }

      if (code == 1000) {
        // set the background image to clear if the weather is clear
        weatherApp.style.backgroundImage = `
        url(./assets/images/${timeOfDay}/clear.jpg)`;

        // change the button bg-color

        // change the button bg-color depending on if it's day or night
        submitBtn.style.background = "#e5ba92";
        if (timeOfDay == "night") {
          submitBtn.style.background = "#181e27";
        }
      } else if (
        // cloudy
        code == 1003 ||
        code == 1006 ||
        code == 1009 ||
        code == 1030 ||
        code == 1069 ||
        code == 1087 ||
        code == 1135 ||
        code == 1273 ||
        code == 1276 ||
        code == 1279 ||
        code == 1282
      ) {
        weatherApp.style.backgroundImage = `
        url(./assets/images/${timeOfDay}/cloudy.jpg)`;
        submitBtn.style.background = "#fa6d1b";
        if (timeOfDay == "night") {
          submitBtn.style.background = "#181e27";
        }
      } else if (
        // rainy
        code == 1063 ||
        code == 1069 ||
        code == 1072 ||
        code == 1150 ||
        code == 1153 ||
        code == 1180 ||
        code == 1183 ||
        code == 1186 ||
        code == 1189 ||
        code == 1192 ||
        code == 1195 ||
        code == 1204 ||
        code == 1207 ||
        code == 1240 ||
        code == 1243 ||
        code == 1246 ||
        code == 1249 ||
        code == 1252
      ) {
        weatherApp.style.backgroundImage = `
        url(./assets/images/${timeOfDay}/rainy.jpg)`;

        submitBtn.style.background = "#647d75";

        if (timeOfDay == "night") {
          submitBtn.style.background = "#325c80";
        }
      } else {
        // snowy
        weatherApp.style.backgroundImage = `
        url(./assets/images/${timeOfDay}/snowy.jpg)`;

        submitBtn.style.background = "#4d72aa";

        if (timeOfDay == "night") {
          submitBtn.style.background = "#1b1b1b";
        }
      }

      // fade in the page once all is done
      weatherApp.style.opacity = "1";
    })

    // if the user types a city that doesn't exist, throw an alert
    .catch(() => {
      alert("City not found, please try again");
      weatherApp.style.opacity = "1";
    });
}

// call the function on page load
fetchWeatherData();

// fade in the page
weatherApp.style.opacity = "1";
