
var map;
var autocomplete;
var places;
var infowindow;
var markers = [];

$(document).ready( function() {

    initialize();

    $('#autocomplete').keydown(function(event){
      if(event.which==13){
        onPlaceChanged();
      }

    });

});


// initialize the map and autocomplete input box
function initialize() {

  var latlng = new google.maps.LatLng(37.1, -95.7);
  var myOptions = {
    zoom: 3,
    center: latlng,
    //mapTypeControl: false,
    panControl: false,
    zoomControl: false,
    streetViewControl: false
  };

  map = new google.maps.Map(document.getElementById('map_canvas'), myOptions);
  
  infowindow = new google.maps.InfoWindow();

  // Create the autocomplete object and associate it with the UI input control.
  // Restrict the search to type "cities".
  autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('autocomplete'),
      {
        types: ['(cities)']
      });
  
  places = new google.maps.places.PlacesService(map);

  google.maps.event.addListener(autocomplete, 'place_changed', onPlaceChanged);
 
}

// things to do when city is changed
function onPlaceChanged() {
  var place = autocomplete.getPlace();
 
  if (place.geometry) {
    map.panTo(place.geometry.location);
    map.setZoom(12);
    search();

  } else {
    document.getElementById('autocomplete').placeholder = 'Enter a city, State';
  }

  $('.results .weather').empty();
  $('.results_summary').show();
  // getWeather(place.geometry.location.G, place.geometry.location.K);
  getWeather(place.formatted_address);

}

//search park nearby and add markers and se infowindow

function search() {
  var request = {
    bounds: map.getBounds(),
    types: ['park']
  };

  places.nearbySearch(request, function (results, status) {

    if (status == google.maps.places.PlacesServiceStatus.OK) {
      //clearResults();
      clearMarkers();

      // Create a marker for each hotel found, and
      // assign a letter of the alphabetic to each marker icon.
      for (var i = 0; i < results.length; i++) {
        // Use marker animation to drop the icons incrementally on the map.
          markers[i] = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            position: results[i].geometry.location,
          });

          markers[i].place = results[i];

          google.maps.event.addListener(markers[i], 'click', function(){
            var place = this.place;
             map.panTo(place.geometry.location);


            var street_view_url = "https://maps.googleapis.com/maps/api/streetview?size=150x100&location=" + place.vicinity;
            var street_view_img = "<img src='" + street_view_url + "'><br>";
            var info_content =  street_view_img+ place.name + "<br><b>Address:</b>" + place.vicinity + '<br>' +ratingExpression(place);

            infowindow.setContent(info_content);
            infowindow.open(map, this);

          });
       }
    }

   });
}


// get the rating expression if there is a rating

function ratingExpression(place){
  var ratingHtml = '';
	if (place.rating) {
        
        for (var i = 0; i < 5; i++) {
            if (place.rating < (i + 0.5)) {
               ratingHtml += '&#10025;';
            } else {
               ratingHtml += '&#10029;';
           }
       }
   }
   return ratingHtml;
}

function clearMarkers(){
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}


// convert unix_timestamp to date
function getDate(unix_timestamp){

  var date_obj = new Date(unix_timestamp*1000);

  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var weekdays = ['Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  var month = months[date_obj.getMonth()];
  var date = date_obj.getDate();
  var weekday = weekdays[date_obj.getDay()];

  return month + ' ' + date + '<br><br>'+ weekday;

}

// this function takes the weather object returned 
// and creates new result to be appended to DOM
var showWeather = function(data) {

	$('.weather').empty();

  // loop to get the weather for each day
  $.each(data.list, function(idex, val){
      // clone our result template code
      var result = $('.weather_tmplate').clone();

      var date = getDate(val.dt);

      // get icon url
      var icon_url = 'http://openweathermap.org/img/w/' + val.weather[0].icon + '.png';

      var condition =  val.weather[0].main ; 

      var temp = parseInt(val.temp.day) - 273 ;

      result.find('img').attr('src',icon_url);
      result.find('.weather_condition').html(condition);
      result.find('.temperature').html(temp+'&#8451');
      result.find('.weather_date').html(date);


      $('.weather').append(result.html());

  });


};



// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

// var getWeather = function(lat, lon){

//   url = "http://api.openweathermap.org/data/2.5/forecast/daily"

// 	var params = {
//     cnt: 3,
// 		lat: lat,
//     lon: lon
// 	};

// 	$.getJSON(url, params, function (data){
//     console.log(data);
// 		showWeather(data);
// 	});

var getWeather = function(address){

  url = "http://api.openweathermap.org/data/2.5/forecast/daily"

 var params = {
    cnt: 3,
    q: address,
    appid: "a04e765b836db31ffa5ac16c3057babd"
 };

 $.getJSON(url, params, function (data){
    // console.log(data);
   showWeather(data);
 });

};







