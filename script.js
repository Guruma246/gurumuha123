const API_KEY = '649d3d7abfbcf42973c3754914e5a4b5';

document.getElementById("getWeatherBtn").addEventListener("click", function () {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) {
    alert("Please enter a city name.");
    return;
  }

  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

  fetch(currentWeatherUrl)
    .then(res => res.json())
    .then(data => {
      if (data.cod !== 200) {
        alert(data.message);
        return;
      }

      document.getElementById("weatherCard").style.display = "block";
      document.getElementById("cityName").textContent = data.name;
      document.getElementById("description").textContent = data.weather[0].description;
      document.getElementById("temperature").textContent = data.main.temp;
      document.getElementById("feelsLike").textContent = data.main.feels_like;
      document.getElementById("humidity").textContent = data.main.humidity;
      document.getElementById("wind").textContent = data.wind.speed;

      const iconCode = data.weather[0].icon;
      document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

      const sunrise = new Date(data.sys.sunrise * 1000);
      const sunset = new Date(data.sys.sunset * 1000);
      document.getElementById("sunrise").textContent = sunrise.toLocaleTimeString();
      document.getElementById("sunset").textContent = sunset.toLocaleTimeString();

      // Fetch 7-day forecast using One Call API
      const lat = data.coord.lat;
      const lon = data.coord.lon;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${API_KEY}&units=metric`;

      fetch(forecastUrl)
        .then(res => res.json())
        .then(forecastData => {
          const forecastContainer = document.getElementById("forecast");
          forecastContainer.innerHTML = '';
          document.getElementById("forecastTitle").style.display = "block";

          forecastData.daily.slice(1, 8).forEach(day => {
            const date = new Date(day.dt * 1000);
            const dayEl = document.createElement("div");
            dayEl.className = "forecast-day";
            dayEl.innerHTML = `
              <strong>${date.toDateString().split(" ")[0]}</strong>
              <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="${day.weather[0].description}" />
              <p>${day.weather[0].description}</p>
              <p>Max: ${day.temp.max.toFixed(1)}°C</p>
              <p>Min: ${day.temp.min.toFixed(1)}°C</p>
            `;
            forecastContainer.appendChild(dayEl);
          });
        });
    })
    .catch(err => {
      console.error("Error:", err);
      alert("Something went wrong.");
    });
});
