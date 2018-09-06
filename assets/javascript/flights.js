// Documentation link: https://docs.kiwi.com/#header-basic-flights-call
// Locations API link to get airport codes/city codes: https://docs.kiwi.com/locations/#locations-collection

// Search result strings to be converted into code
var flyFromInput = "denver"
var flyToInput = "new york city"

// Variable set-up for later
var flyFromFinal;
var flyToFinal;

// ‘dateFrom=01/05/2016’ and ‘dateTo=30/05/2016’ mean that the departure can be anytime between the specified dates. Has to be in DD/MM/YYYY format.

var dateFrom = "01/01/2018"
var dateTo = "01/01/2019"

// To and From query URLs

var fromQueryURL = `https://api.skypicker.com/locations?term=${flyFromInput}`
var toQueryURL = `https://api.skypicker.com/locations?term=${flyToInput}`

// Locations API Destination Pull
$.ajax({
	url: toQueryURL,
	method: "GET"
}).then(function(destination) {

	flyToFinal = destination.locations[0].code;

	// Locations API Origin Pull
	$.ajax({
		url: fromQueryURL,
		method: "GET"
	}).then(function(origin) {

		flyFromFinal = origin.locations[0].code;

		var queryURL =
			`https://api.skypicker.com/flights?flyFrom=${flyFromFinal}&to=${flyToFinal}&dateFrom=${dateFrom}&dateTo=${dateTo}&partner=picky&limit=5&curr=USD`

		// Flights API Pull
		$.ajax({
			url: queryURL,
			method: "GET"
		}).then(function(flights) {

			console.log(queryURL)
			console.log(flights)

			var price = flights.data[0].conversion.USD

			console.log("Flight Price: $" + price)

		});

	});

});