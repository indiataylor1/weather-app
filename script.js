let now = dayjs();
let nowTime = now.format(" HH:mm / MMMM D YYYY");
let dateTime = $("#currentDay");
dateTime.text(nowTime);
nowDate = now.format("DD/MM/YYYY");

var searchFormEl = document.querySelector("#search-form");
var resultTextEl = document.querySelector("#result-text");
var resultContentEl = document.querySelector("#result-content");
let forecastEl = document.getElementById("forecast-body");
let forecastCont = document.getElementById("forecast");
let dataText = localStorage.getItem("dataStorage");
let coords = "";
let forecast = [];
let cardContainerEl = document.getElementById("card-cont");

forecastEl.appendChild(cardContainerEl);

//
function handleSearchFormSubmit(event) {
  event.preventDefault();

  if (forecastEl) {
    while (forecastEl.firstChild) {
      forecastEl.removeChild(forecastEl.firstChild);
    }
  }

  var searchInputVal = document.querySelector("#search-input").value;

  var queryString =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    searchInputVal +
    "&units=metric&APPID=554388edb86f83b04c10657b0a21f79c";

  fetch(queryString).then(function (response) {
    if (response.ok) {
      console.log(response);
      response.json().then(function (data) {
        const dataStorage = JSON.stringify(data);
        localStorage.setItem("dataStorage", dataStorage);
        displayData();
        //displayRepos(data, searchInputVal);
      });
    } else if (response.status === 404) {
      clearInput();
      return;
    }
  });
}

const displayData = function () {
  let dataText = localStorage.getItem("dataStorage");
  let object = JSON.parse(dataText);
  let iconString =
    "<img src=http://openweathermap.org/img/wn/" +
    object.weather[0].icon +
    "@4x.png width=50px height=50px alt>";
  document.getElementById("result-text").innerHTML = object.name;

  let dataDisplay = document.createElement("div");
  dataDisplay.innerHTML = "";
  dataDisplay.setAttribute("class", "result-header col text-center mb-2");
  dataDisplay.innerHTML = object.name + iconString + nowDate;
  let weatherData = document.createElement("ul");
  weatherData.innerHTML = "";
  weatherData.classList =
    "result-body flex-row justify-space-between align-center";
  weatherData.setAttribute("class", "result-body");
  weatherData.innerHTML =
    "Temp: " +
    object.main.temp +
    "\u00B0C" +
    " / " +
    "Wind: " +
    object.wind.speed +
    " MPH" +
    " / " +
    "Humidity: " +
    object.main.humidity +
    "%";
  resultContentEl.innerHTML = "";
  resultContentEl.appendChild(dataDisplay);
  dataDisplay.appendChild(weatherData);

  console.log(resultContentEl);

  var forecastUrl =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    object.name +
    "&units=metric&APPID=554388edb86f83b04c10657b0a21f79c";
  fetch(forecastUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);

          //get today and format it so it can be easily compared with the dates returned by the api call
          var today = dayjs().format("YYYY-MM-DD");
          //console.log(today);
          for (var i = 0; i < data.list.length; i++) {
            //OpenWeather returns a value called dt_txt which is the date and the time separated by a " ".
            var dateTime = data.list[i].dt_txt.split(" ");

            //this is the data we want to add, anything with a date not today and with a time of noon
            if (dateTime[0] !== today && dateTime[1] === "12:00:00") {
              var futureDate = {
                date: dayjs(dateTime[0]).format("DD/MM/YYYY"),
                time: dateTime[0],
                icon: data.list[i].weather[0].icon,
                temp: data.list[i].main.temp,
                wind: data.list[i].wind.speed,
                humidity: data.list[i].main.humidity,
              };
              forecast.push(futureDate);
            }
          }
          displayForecast();
        });
      } else {
        forecastEl.innerHTML =
          "Error: " + response.status + " " + response.statusText;
      }
    })
    .catch(function (error) {
      forecastEl.innerHTML = error.message;
    });
};

let displayForecast = function () {
  let forecastEl = document.getElementById("forecast-body");

  // Set the inner HTML of the forecast container element to an empty string (this will remove all of the child elements)
  forecastEl.innerHTML = "";

  for (var i = 0; i < forecast.length; i++) {
    var cardContainerEl = document.createElement("div");

    cardContainerEl.classList.add("col");
    cardContainerEl.classList.add("col");

    var cardEl = document.createElement("div");
    cardEl.innerHTML = "";
    cardEl.classList.add("card");
    cardEl.classList.add("forecast-card");

    var cardBodyEl = document.createElement("div");
    cardBodyEl.innerHTML = "";
    cardBodyEl.classList.add("card-body");

    var dateEl = document.createElement("h5");
    dateEl.classList.add("card-title");
    dateEl.innerHTML = forecast[i].date;
    cardBodyEl.appendChild(dateEl);

    var iconEl = document.createElement("p");
    iconEl.classList.add("card-text");
    iconEl.innerHTML =
      "<img src='https://openweathermap.org/img/wn/" +
      forecast[i].icon +
      "@2x.png'></img>";
    cardBodyEl.appendChild(iconEl);

    var tempEl = document.createElement("p");
    tempEl.classList.add("card-text");
    tempEl.innerHTML = "Temp: " + forecast[i].temp + "\u00B0C";
    cardBodyEl.appendChild(tempEl);

    var windEl = document.createElement("p");
    windEl.classList.add("card-text");
    windEl.innerHTML = "Wind: " + forecast[i].wind + "MPH";
    cardBodyEl.appendChild(windEl);

    var humidityEl = document.createElement("p");
    humidityEl.classList.add("card-text");
    humidityEl.innerHTML = "Humidity: " + forecast[i].humidity + "%";
    cardBodyEl.appendChild(humidityEl);

    cardEl.appendChild(cardBodyEl);
    cardContainerEl.appendChild(cardEl);
    forecastEl.appendChild(cardContainerEl);
    forecastEl.firstChild.remove;
  }
};

searchFormEl.addEventListener("submit", handleSearchFormSubmit);
