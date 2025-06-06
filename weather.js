const API_KEY = '649d3d7abfbcf42973c3754914e5a4b5';

document.getElementById("getWeatherBtn").addEventListener("click", () => {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) {
    alert("Enter a city.");
    return;
  }

  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`)
    .then(res => res.json())
    .then(data => {
      if (data.cod !== 200) {
        alert(data.message);
        return;
      }

      const { name, sys, main, weather, wind, coord } = data;

      document.getElementById("weatherCard").style.display = "block";
      document.getElementById("cityName").textContent = name + ', ' + sys.country;
      document.getElementById("countryFlag").src = `https://flagcdn.com/48x36/${sys.country.toLowerCase()}.png`;

      document.getElementById("description").textContent = weather[0].description;
      document.getElementById("temperature").textContent = main.temp;
      document.getElementById("feelsLike").textContent = main.feels_like;
      document.getElementById("humidity").textContent = main.humidity;
      document.getElementById("wind").textContent = wind.speed;

      const sunrise = new Date(sys.sunrise * 1000);
      const sunset = new Date(sys.sunset * 1000);
      document.getElementById("sunrise").textContent = sunrise.toLocaleTimeString();
      document.getElementById("sunset").textContent = sunset.toLocaleTimeString();

      fetchForecast(coord.lat, coord.lon);
    });
});

function fetchForecast(lat, lon) {
  const forecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts,current&units=metric&appid=${API_KEY}`;
  fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts,current&units=metric&appid=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      const labels = data.daily.slice(1, 8).map(day => {
        const date = new Date(day.dt * 1000);
        return date.toLocaleDateString(undefined, { weekday: 'short' });
      });

      const temps = data.daily.slice(1, 8).map(day => day.temp.day);

      showForecastChart(labels, temps);
    });
}

function showForecastChart(labels, temps) {
  const canvas = document.getElementById('forecastChart');
  canvas.style.display = 'block';

  if (window.myChart) window.myChart.destroy();

  const ctx = canvas.getContext('2d');
  window.myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Daily Temperature (°C)',
        data: temps,
        borderColor: '#007bff',
        backgroundColor: 'rgba(0,123,255,0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
}
