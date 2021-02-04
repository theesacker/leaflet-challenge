
// Adding Tile Layer
var greyscaleMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
});
// Satellite Layer
var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/satellite-v9",
  accessToken: API_KEY
});
// Outdoor Layer
var outdoorMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/outdoors-v11",
  accessToken: API_KEY
});
var myMap = L.map("mapid", {
  center:[39.83, -98.58],
  zoom: 3,
  layers: [greyscaleMap, satelliteMap, outdoorMap]
});
greyscaleMap.addTo(myMap);

var earthquake = new L.layerGroup();
var tectonicplates = new L.layerGroup();

    // Determine Marker size
    function circleInfo(feature) {
      return{
        opacity: 1,
        fillOpacity: 1,
        fillColor: chooseColor(feature.geometry.coordinates[2]),
        radius: circleSize(feature.properties.mag),
        stroke: true,
        weight: 0.5
      };
    }
    function circleSize(magnitude){
      if (magnitude === 0){
        return 1;
      }
      return magnitude *3;
    }
    function chooseColor(depth){
        return depth >= 90 ? '#800026' :
                depth >= 70  ? '#BD0026' :
                depth >= 50  ? '#E31A1C' :
                depth >= 30  ? '#FC4E2A' :
                depth >= 10   ? '#FD8D3C' :
                   '#FFEDA0';
    };

var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(link).then(function(earthquakeData) {
    console.log(earthquakeData); 
    L.geoJson(earthquakeData,{
      pointToLayer: function(feature, latlng){
        return L.circleMarker(latlng);
      },
      style: circleInfo,
      onEachFeature: function(feature, layer){
        layer.bindPopup(`Location: ${feature.properties.place} <br> Magnitude: ${feature.properties.mag}`)
      }
    }).addTo(earthquake);
    earthquake.addTo(myMap);
  
    });
var baseMaps = {
  "Grey Scale": greyscaleMap,
  "Satellite": satelliteMap,
  "Outdoors": outdoorMap
};
var overlayMaps = {
  "Earthquakes": earthquake,
  "Tectronic Plates": tectonicplates
};
// Create tectonic plate map

var tecLink = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";


d3.json(tecLink).then(function(tectronicData) { 
  L.geoJson(tectronicData,{
    color:"orange",
    weight: 1.5
    }).addTo(tectonicplates);
  tectonicplates.addTo(myMap);

  });

// add layer to control map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);
    