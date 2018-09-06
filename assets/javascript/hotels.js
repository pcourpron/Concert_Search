// Hotel Deals API Documentation: http://developer.hotwire.com/docs/read/Hotel_Deals_API


var destination = "la"; // if spelled wrong, tries to find best match
var withinRadius = 15; // miles

var startDate = "08/08/2018" // Required
var endDate = "01/01/2019" // Optional; if paired with a start date, it looks for an exact stay length from start to end dates.



// duration   (&duration=5~*   # any checkin/checkout dates and length of stay of 5 nights or more)
var minNightsStay = 3
var maxNightsStay = 4
// Right now this sets it to a 3 to 4 night stay.

var queryURL = `http://api.hotwire.com/v1/deal/hotel?apikey=dkvkbmxbs5nzer7hmg6bfd26&limit=5&diversity=city&dest=${destination}&distance=*~${withinRadius}&startdate=${startDate}~${endDate}&duration=${minNightsStay}~${maxNightsStay}&format=JSON`

console.log(queryURL)

// AJAX Call

$.ajax({
    method: 'GET',
    url: queryURL

  }).then(function (response){


  console.log(response)
  console.log("City: "+response.Result[0].City)
  console.log("Price: $"+response.Result[0].Price)



  });


