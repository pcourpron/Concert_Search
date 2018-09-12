// Documentation link: https://docs.kiwi.com/#header-basic-flights-call
// Locations API link to get airport codes/city codes: https://docs.kiwi.com/locations/#locations-collection


function flights(from,end,start) {
	var flightsLoading = $('<h4>').text('Flights loading, please wait.').attr('id', 'flightsLoading')
	var loadingimg = $('<img>').attr({
		id: 'loadingGif',
		src: 'https://gifer.com/i/4V0b.gif'
	})
		.css({
			height: '100px',
			width: '100px',
			margin: '0 auto',
			display: 'block'
		})
	$('#flights').append(flightsLoading, loadingimg)

	var concertLat = locationConcert.latitude
	var concertLong = locationConcert.longitude
	
	// Spelled wrong to test their corrections
	var flyFromInput = from
	var flyFromFinal;

	// Lat-Long-radius to find airports around destination; only takes kilometers...
	var flyTo = concertLat + '-' + concertLong + "-150km"

	console.log(flyTo)

	// ---------- ALL DATES MUST BE IN dd/mm/YYYY FORMAT

	// Required; default to one week before concert
	var dateFrom = start

	// Required; default to One day before the concert
	var dateTo = start


	// Optional; default to One day after the concert
	var returnFrom = end

	// Optional; default to the same as returnFrom
	var returnTo = end



	// To and From query URLs

	var fromQueryURL = `https://api.skypicker.com/locations?term=${flyFromInput}`
	console.log(fromQueryURL)

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
			console.log(queryURL)
		// Flights API Pull
		$.ajax({
			url: queryURL,
			method: "GET"
		}).then(function (flights) {
			console.log(flights)
			
			flights = flights.data
			$('#flightsLoading').hide()
			$('#loadingGif').hide()
			flights.forEach(element => {
				var flightGoDepartureTime = new Date(element.dTime * 1000).toTimeString().substring(0, 5)
				var flightGoDepartureDay = new Date(element.dTime * 1000).toDateString()
				var flightGoDepartureDay2 = new Date(element.aTime * 1000).toDateString()
				var flightGoArrivalTime = new Date(element.aTime * 1000).toTimeString().substring(0, 5)
				var flightduration = element.fly_duration
				var returnLength = parseInt(element.route.length) - 1
				var flightReturnDepartureTime = new Date(element.route[returnLength].dTime * 1000).toTimeString().substring(0, 5)
				var flightReturnArrivalTime = new Date(element.route[returnLength].aTime * 1000).toTimeString().substring(0, 5)
				var flightReturnDay = new Date(element.route[returnLength].dTime * 1000).toDateString()
				var flightReturnDay2 = new Date(element.route[returnLength].aTime * 1000).toDateString()



				var departingTitle = $('<h4>').text('Departing Flight').css({
					'text-align': 'center',
					'width': '100%',
					'margin-top': '10px'

				})
				var returningTitle = $('<h4>').text('Returning Flight').css({ 'text-align': 'center', 'width': '100%' })
				var flightRow = $('<div>').addClass('row rowBorder')
				var flightRow2 = $('<div>').addClass('row')
				var departingTimeCols = $('<div>').addClass('col-sm-6')
				var returningTimeCols = $('<div>').addClass('col-sm-6')
				var cities = $('<div>').addClass('col-sm-6')


				departingTimeCols.append($('<p>').text('Departure: ' + flightGoDepartureTime + ', ' + flightGoDepartureDay))
				departingTimeCols.append($('<p>').text('Arrival: ' + flightGoArrivalTime + ', ' + flightGoDepartureDay2))
				returningTimeCols.append($('<p>').text('Departure: ' + flightReturnDepartureTime + ', ' + flightReturnDay))
				returningTimeCols.append($('<p>').text('Arrival: ' + flightReturnArrivalTime + ', ' + flightReturnDay2))


				cities.append($('<p>').text(element.cityFrom + ' ---> ' + element.cityTo))
				cities.append($('<p>').text('Flight Duration: ' + flightduration))


				var flightTotal = element.conversion.USD

				selectedFlightPrice = flightTotal

				flightRow.append(departingTitle, departingTimeCols, cities)
				flightRow2.append(returningTitle, returningTimeCols, $('<p>').text('Flight Cost: ' + flightTotal + '$').css({ 'margin-top': '20px', 'color': 'red' }))
				$('#flights').append(flightRow, flightRow2)

				function finalPage() {
					//show final page
					$('#final').css('z-index', '10')
					$('#flights').css('z-index', '-1')

					//add flight cost
					minTotal += flightTotal
					maxTotal += flightTotal

					$('#sum').text('$' + minTotal + ' - ' + '$' + maxTotal)

					var finalHeader = $('<h3>').text('Final Itinerary').css({'text-align':'center','width':'100%'});
					var concert = $('<h4>').text('Concert: ' + selectedConcert).css('width','100%')
					var city = $('<h4>').text('City: ' + selectedCity).css('width','100%')
					var totalRange = $('<p>').text('Trip Cost: $' + minTotal + ' - $' + maxTotal).css('width','100%')


					$('#final').append(finalHeader, concert, '<br>',city,'<br>', totalRange)
				}


				flightRow.click(function () {
					finalPage()

				})
				flightRow2.click(function () {
					finalPage()
				})


			});

		});

	});

}