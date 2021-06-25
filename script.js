const apiKey = "bffff5f987eb41b4140733e443ddec2a";
const apiEndPoint = "https://api.openweathermap.org/data/2.5/weather?";
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let units = "metric";
let cityName = "";
let wind = 0;
let humidity = 0;
let temperature = 0;
let weatherIcon = "";
let weatherDescription = "";
let backgroundUrl = "";
let forecastTemperatures = [];

showDateAndTime();
getCurrentPosition();
setEventListeners();

function setEventListeners() {
  document.getElementById("location").addEventListener("click", searchPosition);
  document.getElementById("citysearch").addEventListener("submit", newcity);
  document.getElementById("farenheit").addEventListener("click", changeFarenheit);
  document.getElementById("celcius").addEventListener("click", changeCelcius);
  setUpdateTimer();
}

// API CALLS
function updateForecast(response) {
  let longitude = response.data.coord.lon;
  let latitude = response.data.coord.lat;
  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
  console.log(url);
  axios.get(url).then(saveForecast);
}

function updateWeatherByPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let latLonUrl = `lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;

  axios.get(`${apiEndPoint}${latLonUrl}`).then(processWeatherReponse);
}

function updateWeatherBySearch() {
  let newcity = document.getElementById("citysearchinput").value;
  let cityUrl = `${apiEndPoint}q=${newcity}&units=metric&appid=${apiKey}`;
  axios.get(cityUrl).then(processWeatherReponse);
}

function processWeatherReponse(response) {
  saveCity(response);
  saveTemperature(response);
  saveHumidity(response);
  saveWind(response);
  saveWeatherDescription(response);
  saveBackground(response);
  updateForecast(response);
}

// SAVE FUNCTIONS
function saveCity(response) {
  cityName = response.data.name;
  showCity();
}

function saveTemperature(response) {
  temperature = Math.round(response.data.main.temp);
  showTemperature();
  showUnitChangeButtons();
}

function saveWind(response) {
  wind = Math.round(response.data.wind.speed);
  showWind();
}

function saveHumidity(response) {
  humidity = Math.round(response.data.main.humidity);
  showHumidity();
}

function saveWeatherDescription(response) {
  weatherDescription = response.data.weather[0].description;
  weatherIcon = getWeatherIcon(response.data.weather[0].main);
  showWeatherDescription();
}

function saveBackground(response) {
  backgroundUrl = getBackgroundUrl(response.data.weather[0].main);
  showBackground();
}

function saveForecast(response) {
  let forecastdata = response.data.daily;
  forecastdata.forEach(function (forecastDay, index) {
    if (index > 0 && index < 7) {
      forecastTemperatures[index] = forecastDay;
    }
  });
  showForecast();
}

// DISPLAY FUNCTIONS
function showCity() {
  document.getElementById("city").innerHTML = cityName;
}

function showTemperature() {
  document.getElementById("degrees").innerHTML = `${convertIfNeeded(temperature)}º`;
}

function showUnitChangeButtons() {
  document.getElementById("changeDegree").style.display = "block";
}

function showWind() {
  document.getElementById("wind").innerHTML = `  💨 ${wind}km/h`;
}

function showHumidity() {
  document.getElementById("humidity").innerHTML = `💧${humidity}%  `;
}

function showWeatherDescription() {
  document.getElementById("message").innerHTML = weatherDescription + " " + weatherIcon;
}

function showBackground() {
  document.body.style.backgroundImage = `url('${backgroundUrl}')`;
}

function showForecast() {
  let forecast = document.getElementById("forecast");
  let forecastHTML = "";

  forecastTemperatures.forEach(function (forecastDay) {
    forecastHTML =
      forecastHTML +
      `
<ul class="list-group list-group-horizontal" id="week" >
<li class="list-group-item flex-fill" id="forecastday"> ${forecastDate(forecastDay.dt)}</li>
<li class="list-group-item flex-fill" id="forecastemoji"> ${getWeatherIcon(forecastDay.weather[0].main)} </li>
<li class="list-group-item flex-fill" id="forecastmin"> ${convertIfNeeded(forecastDay.temp.max) + "º"}</li>
<li class="list-group-item flex-fill" id="forecastmax"> ${convertIfNeeded(forecastDay.temp.min) + "º"}</li>
</ul>`;
  });

  forecast.innerHTML = forecastHTML;
}

function showDateAndTime() {
  let dateSrc = new Date();

  document.querySelector("#day").innerHTML = days[dateSrc.getDay()];

  let monthsrc = months[dateSrc.getMonth()];
  let daynumber = dateSrc.getDate();

  let date = document.querySelector("#date");
  date.innerHTML = `${monthsrc} ${daynumber}`;

  let hour = dateSrc.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minutes = dateSrc.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let hours = document.querySelector("#hours");
  hours.innerHTML = `${hour} : ${minutes}`;
}

// EVENT LISTENERS

function newcity(event) {
  event.preventDefault();
  updateWeatherBySearch();
}

function changeFarenheit(event) {
  event.preventDefault();
  units = "imperial";
  showTemperature();
  showForecast();
}

function changeCelcius(event) {
  event.preventDefault();
  units = "metric";
  showTemperature();
  showForecast();
}

function searchPosition(event) {
  event.preventDefault();
  getCurrentPosition();
}

function setUpdateTimer() {
  setTimeout(function () {
    setUpdateTimer();
    showDateAndTime();
  }, 60000);
}

// UTIL METHODS
function getWeatherIcon(message) {
  if (message == "Clear") {
    return `☀️`;
  } else if (message == "Clouds") {
    return `⛅️`;
  } else if (message == "Drizzle" || message == "Rain") {
    return `🌧`;
  } else if (message == "Thunderstorm") {
    return `⛈`;
  } else if (message == "Snow") {
    return `❄️`;
  } else {
    return `☁`;
  }
}

function getBackgroundUrl(description) {
  if (description == "Clear") {
    return "https://s3.amazonaws.com/shecodesio-production/uploads/files/000/011/247/original/clouds.gif?1624307829";
  } else if (description == "Clouds") {
    return "https://s3.amazonaws.com/shecodesio-production/uploads/files/000/011/249/original/clouds2.gif?1624311495";
  } else if (description == "Drizzle" || description == "Rain") {
    return "https://s3.amazonaws.com/shecodesio-production/uploads/files/000/011/230/original/rain.gif?1624288110";
  } else if (description == "Thunderstorm") {
    return "https://s3.amazonaws.com/shecodesio-production/uploads/files/000/011/251/original/thunder.gif?1624312147";
  } else if (description == "Snow") {
    return "https://s3.amazonaws.com/shecodesio-production/uploads/files/000/011/253/original/snow.gif?1624312319";
  } else {
    return "https://s3.amazonaws.com/shecodesio-production/uploads/files/000/011/250/original/fog.gif?1624312053";
  }
}

function forecastDate(timestampInSeconds) {
  return days[getDateInMillis(timestampInSeconds).getDay()];
}

function getDateInMillis(timestampInSeconds) {
  return new Date(timestampInSeconds * 1000);
}

function convertIfNeeded(temperature) {
  if (units === "metric") {
    return Math.round(temperature);
  } else {
    return celsiusToFarenheit(temperature);
  }
}

function celsiusToFarenheit(temperature) {
  return Math.round((temperature * 9) / 5 + 32);
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(updateWeatherByPosition);
}
