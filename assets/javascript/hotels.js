// Hotel Deals API Documentation: http://developer.hotwire.com/docs/read/Hotel_Deals_API

function hotelSearch(location) {

  for (var i = 0; i < venueMarkers.length; i++) {
    venueMarkers[i].setMap(null);
  }

  marker = new google.maps.Marker({
    position: new google.maps.LatLng(location.latitude, location.longitude),
    map: map
  })
  currentVenue.push(marker)
  var latLong = location.latitude + ',' + location.longitude
  // Latitude/Longitude (of LA!)

  var withinRadius = 15; // miles

  var startDate = "10/08/2018" // Required
  var endDate = "10/15/2018" // Optional; if paired with a start date, it looks for an exact stay length from start to end dates.



  // duration   (&duration=5~*   # any checkin/checkout dates and length of stay of 5 nights or more)
  var minNightsStay = 3
  var maxNightsStay = 4
  // Right now this sets it to a 3 to 4 night stay.

  var queryURL = 'http://cors-anywhere.herokuapp.com/' + 'http://api.hotwire.com/v1/search/hotel?apikey=dkvkbmxbs5nzer7hmg6bfd26&rooms=1&adults=2&children=0&dest==' + latLong + '&startdate=' + startDate + '&enddate=' + endDate + '&format=JSON'
  map.setCenter(new google.maps.LatLng(parseFloat(location.latitude), parseFloat(location.longitude)))
  map.setZoom(10.4)

  // AJAX Call

  $.ajax({
    method: 'GET',
    url: queryURL,

  }).then(function (response) {
    var arrayHotel = response.Result
    var arrayNeighborhood = response.MetaData.HotelMetaData.Neighborhoods
    var centers = []
    arrayNeighborhood.forEach(element => {
      var object = { center: element.Centroid, id: element.Id , radius: 1000 }
      centers.push(object)
    })
    console.log(centers.length)
    
    for (let index = 0; index < centers.length; index++) {
      for (let index2 = 0; index2 < centers.length; index2++) {

        if (index === index2) {

        }
        else {
          var lat1 = parseFloat(centers[index].center.split(',')[0])
          var long1 =parseFloat(centers[index].center.split(',')[1])
          var long2 = parseFloat(centers[index2].center.split(',')[1])
          var lat2 = parseFloat(centers[index2].center.split(',')[0])
          myLatLng = new google.maps.LatLng({ lat: lat1, lng:long1  });
          myLatLng2 = new google.maps.LatLng({ lat: lat2 , lng: long2 });


          if (google.maps.geometry.spherical.computeDistanceBetween(myLatLng, myLatLng2) < centers[index].radius*1.5){
            var newCoordinate = {center: ((lat2+lat1)/2).toString() + ',' +((long2+long1)/2).toString(), id: [centers[index].id,centers[index2].id], radius: centers[index].radius*1.3}
            centers.splice(index2,1)
    
            centers[index] = newCoordinate
            index = 0
            index2 = 0
            break
          }
        }
      }
    }
    console.log(centers)
    
    



      centers.forEach(element => {
      var circleCenter = { lat: parseFloat(element.center.split(',')[0]), lng: parseFloat(element.center.split(',')[1]) }
      var cityCircle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.2,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.1,
        map: map,
        center: circleCenter,
        radius: element.radius
      });


      google.maps.event.addListener(cityCircle, 'click', () => {
        console.log(cityCircle)
        cityCircle.setOptions({ fillOpacity: 0.7 })




      });

    })

    arrayHotel.forEach(element => {
      var location1 = { latitude: element.NeighborhoodLatitude, longitude: element.NeighborhoodLongitude }

      marker = new google.maps.Marker({
        position: new google.maps.LatLng(location1.latitude, location1.longitude),
        map: map,
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
      })

      currentHotels.push(marker)
    });


    console.log(response)
    console.log("City: " + response.Result[0].City)
    console.log("Price: $" + response.Result[0].Price)



  });
}

