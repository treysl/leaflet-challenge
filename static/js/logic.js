///// INSTRUCTIONS /////
// Import and visualize the data by doing the following:
    // Using Leaflet, create a map that plots all the earthquakes from your dataset based on their longitude and latitude.
        // Your data markers should reflect the magnitude of the earthquake by their size and the depth of the earthquake by color. Earthquakes with higher magnitudes should appear larger, and earthquakes with greater depth should appear darker in color.
    // Hint: The depth of the earth can be found as the third coordinate for each earthquake.
    // Include popups that provide additional information about the earthquake when its associated marker is clicked.
    // Create a legend that will provide context for your map data.
    // Your visualization should look something like the preceding map.


// Define the url for the GeoJSON earthquake data
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create the map
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
});

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Retrieve and add the earthquake data to the map
d3.json(url).then(function (data) {
    function mapStyle(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: mapColor(feature.geometry.coordinates[2]),
            color: "black",
            radius: mapRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };

        // Establish colors for depth
    }
    function mapColor(depth) {
        switch (true) {
            case depth > 90:
                return "red";
            case depth > 70:
                return "orangered";
            case depth > 50:
                return "orange";
            case depth > 30:
                return "gold";
            case depth > 10:
                return "yellow";
            default:
                return "lightgreen";
        }
    }
    // Establish magnitude size
    function mapRadius(mag) {
        if (mag === 0) {
            return 1;
        }

        return mag * 4;
    }

    // Add earthquake data to the map
    L.geoJson(data, {

        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },

        style: mapStyle,

        // Activate pop-up data when circles are clicked
        onEachFeature: function (feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br>Depth: " + feature.geometry.coordinates[2]);

        }
    }).addTo(myMap);

// Add the legend with colors to corrolate with depth
let legend = L.control({position: "bottomright"});
legend.onAdd = function() {
  let div = L.DomUtil.create("div", "info legend"),
  depth = [-10, 10, 30, 50, 70, 90];

  for (let i = 0; i < depth.length; i++) {
    div.innerHTML +=
    '<i style="background:' + mapColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
  }
  return div;
};
legend.addTo(myMap)
});