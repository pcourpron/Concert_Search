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
  concertLat = location.latitude
  conertLong = location.longitude
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
    var showHotel = []
    var arrayHotel = response.Result
    var arrayNeighborhood = response.MetaData.HotelMetaData.Neighborhoods
    var centers = []


    arrayNeighborhood.forEach(element => {
      var object = { center: element.Centroid, id: element.Id, radius: 1000 }
      centers.push(object)
    })

    for (let index = 0; index < centers.length; index++) {
      for (let index2 = 0; index2 < centers.length; index2++) {

        if (index === index2) {

        }
        else {
          var lat1 = parseFloat(centers[index].center.split(',')[0])
          var long1 = parseFloat(centers[index].center.split(',')[1])
          var long2 = parseFloat(centers[index2].center.split(',')[1])
          var lat2 = parseFloat(centers[index2].center.split(',')[0])
          myLatLng = new google.maps.LatLng({ lat: lat1, lng: long1 });
          myLatLng2 = new google.maps.LatLng({ lat: lat2, lng: long2 });


          if (google.maps.geometry.spherical.computeDistanceBetween(myLatLng, myLatLng2) < centers[index].radius * 1.2) {
            var newCoordinate = { center: ((lat2 + lat1) / 2).toString() + ',' + ((long2 + long1) / 2).toString(), id: [centers[index].id, centers[index2].id], radius: centers[index].radius * 1.2 }
            centers.splice(index2, 1)

            centers[index] = newCoordinate
            index = 0
            index2 = 0
            break
          }
        }
      }
    }






    centers.forEach(element => {

      var circleCenter = { lat: parseFloat(element.center.split(',')[0]), lng: parseFloat(element.center.split(',')[1]) }
      var cityCircle = new google.maps.Circle({
        strokeColor: '#0000FF',
        strokeOpacity: 0.2,
        strokeWeight: 2,
        fillColor: '#0000FF',
        fillOpacity: 0.1,
        map: map,
        center: circleCenter,
        radius: element.radius,
        customInfo: element.id,
        selected: false
      });

      hotelCenters.push(cityCircle)
      console.log(hotelCenters)


      google.maps.event.addListener(cityCircle, 'click', () => {
        if (cityCircle.fillOpacity === .1) {
          cityCircle.setOptions({
            fillOpacity: 0.7,
            radius: cityCircle.radius * 2,
            selected: true
          })

          showHotel.push(cityCircle.customInfo)
          $('#info').children('.row').hide()
          showHotel.forEach(element => {
            $('#info').children('.' + element).show()
          })


        }
        else {
          cityCircle.setOptions({
            fillOpacity: 0.1,
            radius: cityCircle.radius / 2,
            selected: false
          })
          var index = showHotel.indexOf(cityCircle.customInfo);
          if (index > -1) {
            showHotel.splice(index, 1);
          }
          $('#info').children('.row').hide()
          showHotel.forEach(element => {
            $('#info').children('.' + element).show()
          })
          if (showHotel.length === 0)
            $('#info').children('.row').show()

        }

      });

    })

    var results = response.Result
    console.log(results)
    results.sort(function (a, b) {
      return parseInt(a.TotalPrice) - parseInt(b.TotalPrice)
    })



    results.forEach(element => {
      var lodgingType = ''
      switch (element.LodgingTypeCode) {
        case 'H':
          lodgingType = ' Hotel'
          break;
        case 'C':
          lodgingType = ' Condo'
          break;
        case 'A':
          lodgingType = ' All Inclusive Resort'

          break;

        default:
          break;
      }

      var stars = $('<p>').text(element.StarRating + ' Star' + lodgingType).css('text-align', 'center')
      var nightPrice = $('<p>').text('Average Price Per Night: ' + element.AveragePricePerNight).css('text-align', 'center')
      var totalPrice = $('<p>').text('Total Price: ' + element.TotalPrice).css('text-align', 'center')
      var row = $('<div>').addClass('row border ' + element.NeighborhoodId +' hotelRow').attr('data-hood',element.NeighborhoodId).attr('data-price',element.TotalPrice)
      row.append(stars, nightPrice, totalPrice)





      // link row hover to color of circle
      $(row).hover(function () {
        hotelCenters.forEach(center => {
          if (center.customInfo === element.NeighborhoodId) {
            center.setOptions({
              zIndex: 100
            })
            if (center.selected === true) {
              center.setOptions({
                fillColor: 'red',
                fillOpacity: 1,
                strokeColor: 'red',
                radius: center.radius
              })
            }
            else {
              center.setOptions({
                fillColor: 'red',
                fillOpacity: 1,
                strokeColor: 'red',
                radius: center.radius * 2
              })
            }
          }

        })
      }, function () {
        hotelCenters.forEach(center => {
          if (center.customInfo === element.NeighborhoodId) {
            center.setOptions({
              zIndex: 1
            })
            if (center.selected === true) {
              center.setOptions({
                fillColor: '#0000FF',
                fillOpacity: .7,
                strokeColor: '#0000FF',
              })
            }
            else {
              center.setOptions({
                fillColor: '#0000FF',
                fillOpacity: .1,
                strokeColor: '#0000FF',
                radius: center.radius / 2
              })

            }

          }

        })

      }
      )
      $('#info').append(row)
    })


  });
}

