// Documentation link: https://docs.kiwi.com/#header-basic-flights-call
// Locations API link to get airport codes/city codes: https://docs.kiwi.com/locations/#locations-collection


// Spelled wrong to test their corrections
var flyFromInput = "denve" 
var flyFromFinal;

// Lat-Long-radius to find airports around destination; only takes kilometers...
var flyTo = "34.05--118.24-150km" 



// ---------- ALL DATES MUST BE IN dd/mm/YYYY FORMAT

// Required; default to one week before concert
var dateFrom = "01/01/2018" 

// Required; default to One day before the concert
var dateTo = "01/01/2019" 

// Optional; default to One day after the concert
var returnFrom = "31/12/2018" 

// Optional; default to the same as returnFrom
var returnTo = "31/12/2018"



// To and From query URLs

var fromQueryURL = `https://api.skypicker.com/locations?term=${flyFromInput}`

// Locations API Destination Pull


	// Locations API Origin Pull 
	// This converts the input to the official city code for use in flyFromFinal
	$.ajax({
		url: fromQueryURL,
		method: "GET"
	}).then(function(origin) {

		flyFromFinal = origin.locations[0].code;

		var queryURL =
			`https://api.skypicker.com/flights?flyFrom=${flyFromFinal}&to=${flyTo}&dateFrom=${dateFrom}&dateTo=${dateTo}&returnFrom=${returnFrom}&returnTo=${returnTo}&partner=picky&limit=10&curr=USD`

		// Flights API Pull
		$.ajax({
			url: queryURL,
			method: "GET"
		}).then(function(flights) {

		
			console.log(queryURL)
			console.log(flights)

			var price = flights.data[0].conversion.USD

			// Default sorts by price (low to high)

			console.log("Flight Price: $" + price)
			console.log("Flight Price: $" + flights.data[1].conversion.USD)
			console.log("Flight Price: $" + flights.data[2].conversion.USD)
			console.log("Flight Price: $" + flights.data[3].conversion.USD)
			console.log("Flight Price: $" + flights.data[4].conversion.USD)

		});

	});

