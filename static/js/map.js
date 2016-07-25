let map = L.map('map').setView(new L.LatLng(startLat, startLong), startZoom);

// make base layer
let stamenLayer = new L.StamenTileLayer('toner');
map.addLayer(stamenLayer);

// Uncomment the below if you would like to get the historical overlay working

// the historical overlay
// requires a tiling service
// let overlay = new L.TileLayer.WMS("http://server:8080/geoserver/gwc/service/wms", {
//           layers: 'states:Nebraska_wma',
//           format: 'image/png',
//           transparent: true
// });
// overlay.addTo(map);
//
// add a toggle for the two layers
// L.control.layers({ "Plain" : stamenLayer, "Historical" : overlay }).addTo(map);


let makeLinks = function(city, papers) {
  if (papers) {
    let res = "<h4>"+city+"</h4>";
    for (let paper in papers) {
      res += singleLink(paper, papers[paper])
    }
    return res;
  } else {
    return "No papers found for this city";
  }
};

let singleLink = function(name, id) {
  return "<li class='map_paper_link'>"
         +"<a href='../lccn/"
         +id+"/'>"+name+"</a></li>";
};

let circleMarkers = {
  radius: 8,
  fillColor: markerColor,
  color: markerColor,
  weight: 1,
  opacity: 1,
  fillOpacity: .8
};

cities.forEach(function(city) {
  let marker = L.circleMarker(city["latlong"], circleMarkers);
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
