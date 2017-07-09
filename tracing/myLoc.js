/* myLoc.js */
var watchId = null;
var map = null;


window.onload = getMyLocation;

function getMyLocation() {
	//alert("Please fill the form detail only if you want to know how far you are from your home");
	if (navigator.geolocation) {

		//navigator.geolocation.getCurrentPosition(displayLocation,displayError);
		var watchButton = document.getElementById("watch");
		watchButton.onclick = watchLocation; // assingning event to the handler
		var clearWatchButton = document.getElementById("clearWatch");
		clearWatchButton.onclick = clearWatch; // again assingning the event to handler
	}
	else {
		alert("Oops, no geolocation support");
	}
}

function displayLocation(position) {
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;

	var div = document.getElementById("location");
	div.innerHTML = "You are at Latitude: " + latitude + ", Longitude: " + longitude;
	div.innerHTML += " (with " + position.coords.accuracy + " meters accuracy)";

	//var km = computeDistance(position.coords);
	//var distance = document.getElementById("distance");
	//distance.innerHTML = "You are " + km + " km from your home " + userHome;
	//localStorage.setItem('latitude', latitude);
	//localStorage.setItem('longitude',longitude);

	//document.cookie = "latitude:"+latitude;
	//alert(document.cookie);

	//alert(localStorage.getItem('latitude'));
	//localStorage.setItem('cords',position.coords);

	if(map == null)
	{
		showMap(position.coords);


	}else{
	    scrollMapToPosition(position.coords);
	}

	
}


// --------------------- Ready Bake ------------------
//
// Uses the Spherical Law of Cosines to find the distance
// between two lat/long points
//
/*function computeDistance(startCoords) {
	var startLatRads = degreesToRadians(startCoords.latitude);
	var startLongRads = degreesToRadians(startCoords.longitude);
	var destLatRads = degreesToRadians(userLat);
	var destLongRads = degreesToRadians(userLon);

	var Radius = 6371; // radius of the Earth in km
	var distance = Math.acos(Math.sin(startLatRads) * Math.sin(destLatRads) + 
					Math.cos(startLatRads) * Math.cos(destLatRads) *
					Math.cos(startLongRads - destLongRads)) * Radius;

	return distance;
}

function degreesToRadians(degrees) {
	radians = (degrees * Math.PI)/180;
	return radians;
}*/

// ------------------ End Ready Bake -----------------

function showMap(coords) {
	var googleLatAndLong = new  google.maps.LatLng(coords.latitude, coords.longitude);
												  
	var mapOptions = {
		zoom: 14,
		center: googleLatAndLong,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var mapDiv = document.getElementById("map");
	map = new google.maps.Map(mapDiv, mapOptions);

	// add the user marker
	var title = "Your Location";
	var content = "You are here: " + coords.latitude + ", " + coords.longitude;
	addMarker(map, googleLatAndLong, title, content);

}

function addMarker(map, latlong, title, content) {
	var markerOptions = {
		position: latlong,
		map: map,
		title: title,
		clickable: true
	};
	var marker = new google.maps.Marker(markerOptions);

	var infoWindowOptions = {
		content: content,
		position: latlong
	};

	var infoWindow = new google.maps.InfoWindow(infoWindowOptions);

	google.maps.event.addListener(marker, 'click', function() {
		infoWindow.open(map);
	});
}


function displayError(error) {
	var errorTypes = {
		0: "Unknown error",
		1: "Permission denied",
		2: "Position is not available",
		3: "Request timeout"
	};
	var errorMessage = errorTypes[error.code];
	if (error.code == 0 || error.code == 2) {
		errorMessage = errorMessage + " " + error.message;
	}
	var div = document.getElementById("location");
	div.innerHTML = errorMessage;
}


// =================== watching =========== 

var option = {
	enableHighAccuracy: true,
	maximumAge : 60000,
	timeout: 5000
};

function watchLocation(){
	watchId = navigator.geolocation.watchPosition(displayLocation, displayError,option) // watchId is used to clear this watching operation anytime

}

function clearWatch(){
	if (watchId){
		navigator.geolocation.clearWatch(watchId);
		watchId = null;
	}
}

function scrollMapToPosition(coords){
	var latitude = coords.latitude;
	var longitude = coords.longitude;
	var latLong = new google.maps.LatLng(latitude,longitude);

	map.panTo(latLong);
	//localStorage.setItem('map',map);

	addMarker(map,latLong,"Your new location", "You moved to " +latitude+ ' ,' + longitude);
}

 