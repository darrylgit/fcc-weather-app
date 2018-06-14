$(document).ready(function() {

  if (document.location.protocol === "https:") {
    $('#https-link').remove();
  };

var lat;
var lon;
var isItNight = false;



  if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(function(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;

    //'https://cors-anywhere.herokuapp.com/' prefix allows https json api calls
    var api = "https://cors-anywhere.herokuapp.com/api.openweathermap.org/data/2.5/weather?lat="+ lat + "&lon=" + lon + "&appid=5a064f39448c6bddecac93165ac4fcb1&lang=en";
    var api2 = "https://cors-anywhere.herokuapp.com/api.sunrise-sunset.org/json?lat="+ lat + "&lng="+lon+"&date=today&formatted=0";

     function dayNight () {
       $.ajax({
         url: api2,
         success: function(response){
           var time = Math.round((new Date).getTime()/1000);
           var sunrise = Math.round(moment.utc(response.results.sunrise)/1000);
           var sunset = Math.round(moment.utc(response.results.sunset)/1000);

           if ( time < sunrise || time >= sunset ) {
             $('body').toggleClass('daytime nighttime');
             $('#https-link').css('background-color', 'black');
             isItNight = true;
           }

           //Call inside dayNight so asynchronous Ajax function can receive modified global isItNight
           getWeatherInfo();
         }
       });
     }



    function getWeatherInfo () {
      $.ajax({
        url: api,
        success: function(response){
          var tempC = Math.round((response.main.temp) - 273.15);
          var tempF = Math.round((9/5)*((response.main.temp)-273.15)+32);
          var main = response.weather[0].main;
          var apiID = response.weather[0].id;
          var city = response.name;
          $('#current-city').text(city);
          $('#temperature').text(tempC + '°');
          $('#weather-description').text(main);


          //Toggle Celsius and Fahrenheit
          var tempSwap = false;
              $('#temp-toggle').on('click', function() {
                if (tempSwap === false) {
                  $('#temperature').text(tempF + '°');
                  $('#temp-toggle').text('F');
                  tempSwap = true
              } else if (tempSwap === true) {
                  $('#temperature').text(tempC + '°');
                  $('#temp-toggle').text('C');
                  tempSwap = false
                }
              });

          //Raise thermometer level according to temperature
          if (tempC >= 0 && tempC < 10 ) {
           $('#thermometer').toggleClass('fa-thermometer-empty fa-thermometer-quarter')
            } else if (tempC >= 10 && tempC < 20) {
              $('#thermometer').toggleClass('fa-thermometer-empty fa-thermometer-half')
            } else if (tempC >= 20 && tempC < 30) {
              $('#thermometer').toggleClass('fa-thermometer-empty fa-thermometer-three-quarters')
            } else if (tempC >= 30) {
              $('#thermometer').toggleClass('fa-thermometer-empty fa-thermometer-full')
            };

          //Replace loading icon with weather icon
          function switchIcon(dayIcon, nightIcon) {
            if(nightIcon && isItNight) {
              $('#weather-icon').removeClass('fa-o-notch fa-spin fa-3x fa-fw').addClass(nightIcon).addClass('pl-2');
            } else {
              $('#weather-icon').removeClass('fa-o-notch fa-spin fa-3x fa-fw').addClass(dayIcon)
            }
          }

          switch (apiID) {
            case 201:
            case 202:
            case 212:
            case 221:
            case 232:
            case 771:
            case 960:
            case 961:
              switchIcon('wi wi-thunderstorm', 'wi wi-night-alt-thunderstorm');
              break;
            case 200:
            case 210:
            case 230:
            case 231:
              switchIcon('wi wi-storm-showers', 'wi wi-night-alt-storm-showers');
              break;
            case 300:
            case 301:
            case 310:
            case 311:
            case 313:
              switchIcon('wi wi-night-alt-sprinkle', 'wi wi-sprinkle');
              break;
            case 302:
            case 312:
            case 314:
            case 321:
            case 500:
            case 520:
            case 521:
            case 531:
              switchIcon('wi wi-showers', 'wi wi-night-alt-showers');
              break;
            case 501:
            case 502:
            case 503:
            case 504:
            case 522:
              switchIcon('wi wi-rain', 'wi wi-night-alt-rain');
              break;
            case 600:
            case 601:
            case 602:
              switchIcon('wi wi-snowflake-cold');
              break;
            case 611:
            case 612:
              switchIcon('wi wi-sleet', 'wi wi-night-alt-sleet');
              break;
            case 615:
            case 616:
            case 620:
            case 621:
            case 622:
              switchIcon('wi wi-rain-mix', 'wi wi-night-alt-rain-mix');
              break;
            case 701:
            case 721:
            case 741:
              switchIcon('wi wi-fog', 'wi wi-night-fog');
              break;
            case 731:
            case 751:
              switchIcon('wi wi-sandstorm');
              break;
            case 761:
              switchIcon('wi wi-dust');
              break;
            case 762:
              switchIcon('wi wi-volcano');
              break;
            case 781:
            case 900:
              switchIcon('wi wi-tornado');
              break;
            case 800:
            case 904:
            case 951:
              switchIcon('wi wi-day-sunny', 'wi wi-night-clear');
              break;
            case 801:
            case 802:
            case 803:
            case 804:
              switchIcon('wi wi-cloudy', 'wi wi-night-alt-cloudy');
              break;
            case 901:
            case 902:
            case 962:
              switchIcon('wi wi-hurricane');
              break;
            case 905:
            case 956:
            case 957:
            case 958:
            case 959:
              switchIcon('wi wi-strong-wind');
              break;
            case 906:
              switchIcon('wi wi-hail', 'wi wi-night-alt-hail');
              break;
            case 952:
            case 953:
            case 954:
            case 955:
              switchIcon('wi wi-windy');
              break;
            default:
              switchIcon('wi wi-na');
            }
          }
        });
      }
    dayNight();
    });
  } else {
  alert("Sorry! Your browser won't let us see where you're located. This may be due to an HTTP connection. To switch to HTTPS, click the link at the bottom of the page :-)");
  }

  //Remove focus styling after user has clicked button and moved cursor away
  $("#temp-toggle").mousedown(function(e){
e.preventDefault();
  });

});
