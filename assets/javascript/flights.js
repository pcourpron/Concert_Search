// Documentation link: https://docs.kiwi.com/#header-basic-flights-call
// Locations API link to get airport codes/city codes: https://docs.kiwi.com/locations/#locations-collection


// Departure destination info
var flyFrom = "LAX"
var flyTo = "JFK"

// ‘dateFrom=01/05/2016’ and ‘dateTo=30/05/2016’ mean that the departure can be anytime between the specified dates.
var dateFrom = "01/01/2018"
var dateTo = "01/01/2019"





var queryURL = `https://api.skypicker.com/flights?flyFrom=${flyFrom}&to=${flyTo}&dateFrom=${dateFrom}&dateTo=${dateTo}&partner=picky&limit=5&curr=USD`

$.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {

    console.log(response)

    var price = response.data[0].conversion.USD

    console.log(price)

  });