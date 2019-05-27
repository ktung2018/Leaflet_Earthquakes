// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});


function createFeatures(earthquakeData) {
 // var markers = L.markerClusterGroup();
  // Define a function we want to run once for each feature in the features array
   // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + "Magnitude: "+feature.properties.mag+"<p>"+feature.properties.place+"</p>" +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

L.geoJson(earthquakeData, {
  // We turn each feature into a circleMarker on the map.
  pointToLayer: function(feature, latlng) {
    return L.circleMarker(latlng);
  },
  // We set the style for each circleMarker using our styleInfo function.
  //style: styleInfo,
   // We create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
  onEachFeature: function(feature, layer) {
    layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
  }
}).addTo(myMap);

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
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

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap,
    "Light Map": lightmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
