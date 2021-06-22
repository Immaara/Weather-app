function getDate() {
  let dateSrc = new Date();

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let daysrc = days[dateSrc.getDay()];

  let day = document.querySelector("#day");
  day.innerHTML = daysrc;

  let months = [
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

getDate();

//Search Engine

let apiKey = "bffff5f987eb41b4140733e443ddec2a";
let apiEndPoint = "https://api.openweathermap.org/data/2.5/weather?";
let units = "metric";
let latLonUrl = "";
let cityurl = "";
let temperature = 0;

// Current Position
navigator.geolocation.getCurrentPosition(coordinates);

function searchPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(coordinates);
}

document.getElementById("location").addEventListener("click", searchPosition);

function coordinates(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  latLonUrl = `lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;

  axios.get(`${apiEndPoint}${latLonUrl}`).then((response) => {
    showCity(response);
    showTemperature(response);
    showHumidity(response);
    showWind(response);
    showDescription(response);
    emoji(response);
    background(response.data.weather[0].main);
    displayForecast();
  });
}

function showCity(response) {
  let currentCity = response.data.name;
  let city = document.getElementById("city");
  city.innerHTML = currentCity;
}

function showTemperature(response) {
  temperature = Math.round(response.data.main.temp);
  let degrees = document.getElementById("degrees");
  degrees.innerHTML = `${temperature}º`;
  document.getElementById("changeDegree").style.display = "block";
}

function showWind(response) {
  let currentWind = Math.round(response.data.wind.speed);
  let wind = document.getElementById("wind");
  wind.innerHTML = `  💨 ${currentWind}km/h`;
}

function showHumidity(response) {
  let currentHumidity = Math.round(response.data.main.humidity);
  let humidity = document.getElementById("humidity");
  humidity.innerHTML = `💧${currentHumidity}%  `;
  console.log(response.data);
}

function showDescription(response) {
  let message = response.data.weather[0].description;
  let description = document.getElementById("message");
  description.innerHTML = message + " " + emoji(response.data.weather[0].main);
}

function emoji(message) {
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

function background(description) {
  if (description == "Clear") {
    document.body.style.backgroundImage =
      "url('https://s3.amazonaws.com/shecodesio-production/uploads/files/000/011/247/original/clouds.gif?1624307829')";
  } else if (description == "Clouds") {
    document.body.style.backgroundImage =
      "url('https://s3.amazonaws.com/shecodesio-production/uploads/files/000/011/249/original/clouds2.gif?1624311495')";
  } else if (description == "Drizzle" || description == "Rain") {
    document.body.style.backgroundImage =
      "url('https://s3.amazonaws.com/shecodesio-production/uploads/files/000/011/230/original/rain.gif?1624288110')";
  } else if (description == "Thunderstorm") {
    document.body.style.backgroundImage =
      "url('https://s3.amazonaws.com/shecodesio-production/uploads/files/000/011/251/original/thunder.gif?1624312147')";
  } else if (description == "Snow") {
    document.body.style.backgroundImage =
      "url('https://s3.amazonaws.com/shecodesio-production/uploads/files/000/011/253/original/snow.gif?1624312319')";
  } else {
    document.body.style.backgroundImage =
      "url('https://s3.amazonaws.com/shecodesio-production/uploads/files/000/011/250/original/fog.gif?1624312053')";
  }
}

//NEW CITY

document.querySelector("#citysearch").addEventListener("submit", newcity);

function newcity(event) {
  event.preventDefault();
  getcityinfo();
}

function getcityinfo() {
  let newcity = document.getElementById("citysearchinput").value;
  cityurl = `${apiEndPoint}q=${newcity}&units=${units}&appid=${apiKey}`;
  axios.get(cityurl).then((response) => {
    showCity(response);
    showTemperature(response);
    showWind(response);
    showHumidity(response);
    showDescription(response);
    emoji(response);
    background(response.data.weather[0].main);
    displayForecast();
  });
}

//Degrees
function changeFarenheit(event) {
  event.preventDefault();
  let degrees = document.querySelector("#degrees");
  degrees.innerHTML = `${Math.round((temperature * 9) / 5 + 32)}º`;
}

let farenheit = document.querySelector("#farenheit");
farenheit.addEventListener("click", changeFarenheit);

function changeCelcius(event) {
  event.preventDefault();
  let degrees = document.getElementById("degrees");
  degrees.innerHTML = `${temperature}º`;
}

let celcius = document.getElementById("celcius");
celcius.addEventListener("click", changeCelcius);

// FORECAST

function displayForecast() {
  let forecast = document.getElementById("forecast");
  let forecastHTML = "";
  let days = ["Wednesday", "Thursday", "Friday"];

  days.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `
<ul class="list-group list-group-horizontal" id="week" >
<li class="list-group-item"> ${day}</li>
<li class="list-group-item"> 18º</li>
<li class="list-group-item"> 🌤</li>
</ul>`;
  });

  forecast.innerHTML = forecastHTML;
}
