
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoidHVuZ2siLCJhIjoiY2ppZHo4OXIwMGd0NDNrcGkzZDV0ZXE2eCJ9.t1Xpklyzo_R5_G8bJ_ygxg"
); 
var lightmap = L.tileLayer(
  "https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoidHVuZ2siLCJhIjoiY2ppZHo4OXIwMGd0NDNrcGkzZDV0ZXE2eCJ9.t1Xpklyzo_R5_G8bJ_ygxg"
);
var darkmap = L.tileLayer(
  "https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoidHVuZ2siLCJhIjoiY2ppZHo4OXIwMGd0NDNrcGkzZDV0ZXE2eCJ9.t1Xpklyzo_R5_G8bJ_ygxg"
);

// We create the map object with options.
var map = L.map("mapid", {
  center: [40.7, -94.5],
  zoom: 3,
  layers: [streetmap]
});

var baseMaps = {
  "Street Map": streetmap,
  "Dark Map": darkmap,
  "Light Map": lightmap
};

L.control.layers(baseMaps).addTo(map);

// Here we make an AJAX call that retrieves our earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {

  // Here we add a GeoJSON layer to the map once the file is loaded.
  L.geoJson(data, {
    // We turn each feature into a circleMarker on the map.
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    // We set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
    
    // We create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
    onEachFeature: function(feature, layer) {
      layer.bindPopup("<h3>" + "Magnitude: "+feature.properties.mag+"<p>"+feature.properties.place+"</p>" +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }
  }).addTo(map);

  // Style data for each of the earthquakes we plot on the map. 
  function styleInfo(feature) {
    return {
      fillOpacity: 0.75,
      fillColor: "red",
      color: "black",
      radius: (feature.properties.mag)*4,
    };
  }
});
