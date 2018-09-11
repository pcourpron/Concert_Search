// Documentation link: https://docs.kiwi.com/#header-basic-flights-call
// Locations API link to get airport codes/city codes: https://docs.kiwi.com/locations/#locations-collection


function flights() {
	var concertLat = 34.0522
	var concertLong = 118.2437
	// Spelled wrong to test their corrections
	var flyFromInput = "Shanghai"
	var flyFromFinal;

	// Lat-Long-radius to find airports around destination; only takes kilometers...
	var flyTo = concertLat + '--' + concertLong + "-150km"



	// ---------- ALL DATES MUST BE IN dd/mm/YYYY FORMAT

	// Required; default to one week before concert
	var dateFrom = "10/10/2018"

	// Required; default to One day before the concert
	var dateTo = "10/10/2018"


	// Optional; default to One day after the concert
	var returnFrom = "10/11/2018"

	// Optional; default to the same as returnFrom
	var returnTo = "10/11/2018"



	// To and From query URLs

	var fromQueryURL = `https://api.skypicker.com/locations?term=${flyFromInput}`

	// Locations API Destination Pull


	// Locations API Origin Pull 
	// This converts the input to the official city code for use in flyFromFinal
	$.ajax({
		url: fromQueryURL,
		method: "GET"
	}).then(function (origin) {

		flyFromFinal = origin.locations[0].code;
		console.log(flyFromFinal)

		var queryURL =
			`https://api.skypicker.com/flights?flyFrom=${flyFromFinal}&to=${flyTo}&dateFrom=${dateFrom}&dateTo=${dateTo}&returnFrom=${returnFrom}&returnTo=${returnTo}&partner=picky&limit=10&curr=USD`

		// Flights API Pull
		$.ajax({
			url: queryURL,
			method: "GET"
		}).then(function (flights) {
			console.log(flights)
			flights = flights.data

			flights.forEach(element => {
				var flightGoDepartureTime = new Date(element.dTime * 1000).toTimeString().substring(0, 5)
				var flightGoDepartureDay = new Date(element.aTime * 1000).toDateString()
				var flightGoDepartureDay2 = new Date(element.dTime * 1000).toDateString()
				var flightGoArrivalTime = new Date(element.aTime * 1000).toTimeString().substring(0, 5)
				var flightduration = element.fly_duration
				var returnLength = parseInt(element.route.length) - 1
				var flightReturnDepartureTime = new Date(element.route[returnLength].aTime * 1000).toTimeString().substring(0, 5)
				var flightReturnArrivalTime = new Date(element.route[returnLength].aTime * 1000).toTimeString().substring(0, 5)
				var flightReturnDay = new Date(element.route[returnLength].aTime * 1000).toDateString()
				var flightReturnDay2 = new Date(element.route[returnLength].aTime * 1000).toDateString()



				console.log(new Date(element.dTime * 1000).toDateString())
				var departingTitle = $('<h4>').text('Departing Flight').css({
					'text-align': 'center',
					'width': '100%'

				})
				var returningTitle = $('<h4>').text('Returning Flight').css({ 'text-align': 'center', 'width': '100%' })
				var row = $('<div>').addClass('row border')
				var row2 = $('<div>').addClass('row')
				var departingTimeCols = $('<div>').addClass('col-sm-6')
				var returningTimeCols = $('<div>').addClass('col-sm-6')
				var cities = $('<div>').addClass('col-sm-6')


				departingTimeCols.append($('<p>').text('Departure: ' + flightGoDepartureTime + ', ' + flightGoDepartureDay))
				departingTimeCols.append($('<p>').text('Arrival: ' + flightGoArrivalTime + ', ' + flightGoDepartureDay2))
				returningTimeCols.append($('<p>').text('Departure: ' + flightReturnDepartureTime + ', ' + flightReturnDay))
				returningTimeCols.append($('<p>').text('Arrival: ' + flightReturnArrivalTime + ', ' + flightReturnDay2))


				cities.append($('<p>').text(element.cityFrom + ' ---> ' + element.cityTo))
				cities.append($('<p>').text('Flight Duration: ' + flightduration))




				row.append(departingTitle, departingTimeCols, cities)
				row2.append(returningTitle, returningTimeCols, $('<p>').text('Flight Cost: ' + element.conversion.USD + '$').css({ 'margin-top': '20px', 'color':'red' }))
				$('#flights').append(row, row2)
				console.log('hi')
			});

		});

	});

}