// Creating map object
// var map = L.map("map", {
//   center: [35.9132, -79.0558],
//   zoom: 11
// });

// Adding tile layer
// L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//   maxZoom: 18,
//   id: "mapbox.streets",
//   accessToken: API_KEY
// }).addTo(map);


// Store the API endpoint inside link
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"  
// "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337"


// Perform a GET request to the query URL
d3.json(link, function(data1) {
  // Once we get a response, send the data.features object to the createFeatures function
  console.log("inside d3.json")
  console.log(data1)
  createFeatures(data1.features);
console.log("inside features")
console.log(data1.features)
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
      radius: markerSize(feature.properties.mag),
      fillColor: fillColor(feature.properties.mag),
      color: "red",
      weight: 0.4,
      opacity: 0.5,
      fillOpacity: 0.4
      });
    },
  
  onEachFeature: function (feature, layer) {
    return layer.bindPopup(`<strong>Place:</strong> ${feature.properties.place}<br><strong>Magnitude:</strong> ${feature.properties.mag}`);

  }
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  console.log("inside create map")

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });


  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };
console.log(baseMaps)
console.log("logging basemaps")

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };
  console.log(overlayMaps)

  // Create the map, giving it the streetmap and earthquakes layers to display on load- not sure if these are good coordinates
  var myMap = L.map("map", {
    center: [
      36.78, -119.42
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

};

// Set up the legend 
function fillColor(magnituge) {

  // console.log("inside fillColor")


  switch (true) {
    case magnituge >= 6.0:
      return 'blue';
      break;
    
    case magnituge >= 5.0:
      return 'orangered';
      break;

    case magnituge >= 4.0:
      return 'darkorange';
      break;
    
    case magnituge >= 3.0:
      return 'orange';
      break;

    case magnituge >= 2.0:
      return 'gold';
      break;

    case magnituge >= 1.0:
      return 'yellow';
      break;

    default:
      return 'greenyellow';
  };
};


// Reflect the earthquake magnitude
function markerSize(magnituge) {
  // console.log("inside marker size")
return magnituge*6;


}





