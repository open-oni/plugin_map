$(function() {
  var map = L.map('map_container').setView(new L.LatLng(startLat, startLong), startZoom);

  // make base layer
  map.addLayer(L.tileLayer('https://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      maxZoom:20,
      subdomains:'abc',
      attribution:'\xa9 <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors. Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
    }
  ));

  // Uncomment the below if you would like to get the historical overlay working

  // the historical overlay
  // requires a tiling service
  // var overlay = new L.TileLayer.WMS("http://server:8080/geoserver/gwc/service/wms", {
  //           layers: 'states:Nebraska_wma',
  //           format: 'image/png',
  //           transparent: true
  // });
  // overlay.addTo(map);
  //
  // add a toggle for the two layers
  // L.control.layers({ "Plain" : plainLayer, "Historical" : overlay }).addTo(map);


  var makeLinks = function(city, papers) {
    if (papers) {
      var res = "<h4>"+city+"</h4>";
      for (var paper in papers) {
        res += singleLink(paper, papers[paper])
      }
      return res;
    } else {
      return "No papers found for this city";
    }
  };

  var singleLink = function(name, id) {
    return "<li class='map_paper_link'>"
           +"<a href='../lccn/"
           +id+"/'>"+name+"</a></li>";
  };

  var circleMarkers = {
    radius: 8,
    fillColor: markerColor,
    color: markerColor,
    weight: 1,
    opacity: 1,
    fillOpacity: .8
  };

  cities.forEach(function(city) {
    var marker = L.circleMarker(city["latlong"], circleMarkers);
    marker.addTo(map);
    marker.bindPopup(makeLinks(city["name"], city["papers"]));
    
    // add a mouseover that waits for you to click away before closing
    marker.on('mouseover', function(e) {
      this.openPopup();
    });
    marker.on('click', function(e) {
      this.closePopup();
    });
  });
});
