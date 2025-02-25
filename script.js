// {
// const url =
// 	'https://api.openweathermap.org/data/2.5/weather';
// const apiKey =
// 	'f00c38e0279b7bc85480c3fe775d518c';

// $(document).ready(function () {
// 	weatherFn('Pune');
// });

// async function weatherFn(cName) {
// 	const temp =
// 		`${url}?q=${cName}&appid=${apiKey}&units=metric`;
// 	try {
// 		const res = await fetch(temp);
// 		const data = await res.json();
// 		if (res.ok) {
// 			weatherShowFn(data);
// 		} else {
// 			alert('City not found. Please try again.');
// 		}
// 	} catch (error) {
// 		console.error('Error fetching weather data:', error);
// 	}
// }

// function weatherShowFn(data) {
// 	$('#city-name').text(data.name);
// 	$('#date').text(moment().
// 		format('MMMM Do YYYY, h:mm:ss a'));
// 	$('#temperature').
// 		html(`${data.main.temp}°C`);
// 	$('#description').
// 		text(data.weather[0].description);
// 	$('#wind-speed').
// 		html(`Wind Speed: ${data.wind.speed} m/s`);
//     $('#humidity').html(`Humidity: ${data.main.humidity}%`); // Display humidity
//     $('#uv-index').html(`UV Index: ${data.uv}`); // Display UV index
// 	// $('#weather-icon').
// 	// 	attr('src',
// 	// 		`...`);
//     $('#weather-icon').attr('src', `http://openweathermap.org/img/w/${data.weather[0].icon}.png`);
// 	$('#weather-info').fadeIn();
// }
// }

// ----------------------------------------------------------------------------------------------

// const url = 'https://api.openweathermap.org/data/2.5/weather';
// const apiKey = 'f00c38e0279b7bc85480c3fe775d518c'; // Remember to keep API keys secure in production

// $(document).ready(function () {
//     weatherFn('varanasi'); // Initial city
//     $('#search-button').click(function () {
//         const cityName = $('#city-input').val();
//         weatherFn(cityName);
//     });
// });

// async function weatherFn(cName) {
//     const temp = `${url}?q=${cName}&appid=${apiKey}&units=metric`;
//     try {
//         const res = await fetch(temp);
//         const data = await res.json();

//         if (res.ok) {
//             const lat = data.coord.lat;
//             const lon = data.coord.lon;

//             const uvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;
//             const uvRes = await fetch(uvUrl);

//             if (uvRes.ok) {
//                 const uvData = await uvRes.json();
//                 data.uv = uvData.value;
//             } else {
//                 console.error("Error fetching UV data:", uvRes.status, uvRes.statusText, await uvRes.text());
//                 data.uv = "N/A";
//             }

//             weatherShowFn(data);
//         } else {
//             $('#error-message').text('City not found. Please try again.');
//         }
//     } catch (error) {
//         console.error('Error fetching weather data:', error);
//         $('#error-message').text('Error fetching data. Please try again later.');
//     }
// }

// function weatherShowFn(data) {
//     $('#city-name').text(data.name);
//     $('#date').text(moment().format('MMMM Do YYYY, h:mm:ss a'));
//     $('#temperature').html(`${data.main.temp}°C`);
//     $('#description').text(data.weather[0].description);
//     $('#wind-speed').html(`Wind Speed: ${data.wind.speed} m/s`);
//     $('#weather-icon').attr('src', `http://openweathermap.org/img/w/${data.weather[0].icon}.png`);
//     $('#humidity').html(`Humidity: ${data.main.humidity}%`);
//     $('#uv-index').html(`UV Index: ${data.uv}`);

//     $('#weather-info').fadeIn();
//     $('#error-message').text('');
// }

// -------------------------------------------------------------------------------------------------

const apiKey = 'f00c38e0279b7bc85480c3fe775d518c'; // Replace with your OpenWeatherMap API key


$(document).ready(function () {
    weatherFn('Varanasi'); // Initial city
    $('#city-input-btn').click(function () {
        const cityName = $('#city-input').val();
        if (cityName.trim() !== "") {
            weatherFn(cityName);
        } else {
            alert("Please enter a city name.");
        }
    });

    $('#city-input').keypress(function (event) {
        if (event.which === 13) {
            $('#city-input-btn').click();
        }
    });
});

async function weatherFn(cName) {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cName}&appid=${apiKey}&units=metric`;
    $('#weather-info').hide();
    $('#loading-message').show();
    $('#error-message').text("");

    try {
        const res = await fetch(currentWeatherUrl);
        if (res.ok) {
            const currentWeatherData = await res.json();

            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${currentWeatherData.coord.lat}&lon=${currentWeatherData.coord.lon}&appid=${apiKey}&units=metric`;
            const forecastRes = await fetch(forecastUrl);

            if (forecastRes.ok) {
                const forecastData = await forecastRes.json();
                updateWeatherInfo(currentWeatherData);
                updateHighlights(currentWeatherData);
                displayWeeklyForecast(forecastData.list);
            } else {
                console.error("Error fetching forecast data:", forecastRes.status, forecastRes.statusText);
                alert("Error fetching forecast data.");
            }
        } else {
            alert("City not found. Please try again.");
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert("Error fetching data. Please try again later.");
    } finally {
        $('#loading-message').hide();
    }
}

function updateWeatherInfo(data) {
    $('#city-name').text(data.name);
    $('#date').text(moment().format('MMMM Do YYYY, h:mm:ss a'));
    $('#temperature').html(`${data.main.temp}°C`);
    $('#description').text(data.weather[0].description);
    $('#wind-speed').html(`Wind Speed: ${data.wind.speed} m/s`);
    $('#weather-icon').attr('src', `http://openweathermap.org/img/w/${data.weather[0].icon}.png`);
    $('#weather-icon').attr('alt', data.weather[0].description);
    $('#humidity').html(`Humidity: ${data.main.humidity}%`);
    $('#uv-index').html(`UV Index: ${data.uv || "N/A"}`);
    $('#weather-info').fadeIn();
}

function updateHighlights(data) {
    // UV Index
    $('.highlight-grid .highlight-item:eq(0) .text-4xl').text(`N/A`); // Or fetch from API if available

    // Feels Like (If available in API - if not, set to N/A or calculate)
    $('.highlight-grid .highlight-item:eq(1) .text-4xl').text(data.main.feels_like ? `${data.main.feels_like}°C` : 'N/A');

    // Humidity
    $('.highlight-grid .highlight-item:eq(2) .text-4xl').text(`${data.main.humidity}%`);

    // Wind Speed
    $('.highlight-grid .highlight-item:eq(3) .text-4xl').text(`${data.wind.speed} m/s`);

    // Visibility (If available in API - if not, set to N/A)
    $('.highlight-grid .highlight-item:eq(4) .text-4xl').text(data.visibility ? `${data.visibility} m` : 'N/A');

    // Air Pressure
    $('.highlight-grid .highlight-item:eq(5) .text-4xl').text(`${data.main.pressure} hPa`);

    // Sunrise
    const sunrise = moment(data.sys.sunrise * 1000).format('h:mm A');
    $('.highlight-grid .highlight-item:eq(6) .text-4xl').text(sunrise);

    // Sunset
    const sunset = moment(data.sys.sunset * 1000).format('h:mm A');
    $('.highlight-grid .highlight-item:eq(7) .text-4xl').text(sunset);

    // Clouds
    $('.highlight-grid .highlight-item:eq(8) .text-4xl').text(`${data.clouds.all}%`);
}

function displayWeeklyForecast(forecastList) {
    const today = moment().startOf('day');
    const nextSixDays = [];

    for (let i = 1; i <= 6; i++) {
        nextSixDays.push(moment().add(i, 'days').startOf('day'));
    }

    $('.week-grid').empty();

    let daysDisplayed = 0; // Keep track of how many days we've displayed

    nextSixDays.forEach(day => {
        if (daysDisplayed < 4) { // Only display up to 4 days
            const forecastForDay = forecastList.find(forecast => {
                const forecastDate = moment(forecast.dt_txt).startOf('day');
                return forecastDate.isSame(day);
            });

            if (forecastForDay) {
                const date = day.format('dddd, MMMM D');
                const icon = `http://openweathermap.org/img/w/${forecastForDay.weather[0].icon}.png`;
                const description = forecastForDay.weather[0].description;
                const temp = forecastForDay.main.temp;

                const forecastItem = `
                    <div class="week-item">
                        <div>${date}</div>
                        <img src="${icon}" alt="${description}">
                        <div>${description}</div>
                        <div>${temp}°C</div>
                    </div>
                `;
                $('.week-grid').append(forecastItem);
                daysDisplayed++; // Increment counter since we displayed a day
            }
            // No "else" needed. If no data, we simply skip to the next day
        }
    });
}