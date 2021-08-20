import { mapBases, mapOverlay } from './layers';
import OsmoseMarker from './Osmose.Marker';
import OsmoseHeatmap from './Osmose.Heatmap';

import 'leaflet-active-area/src/leaflet.activearea.js';
import './Location.js';
import 'leaflet-control-geocoder/src/index.js';
import 'leaflet-control-geocoder/Control.Geocoder.css';
import 'leaflet-loading';
import 'leaflet-loading/src/Control.Loading.css';

export function initMap(itemState, mapState, tileQuery) {
  const layers = [];
  Object.values(mapBases).forEach((layer) => {
    layers.push(layer);
  });

  // Map
  const map = L.map('map', {
    center: new L.LatLng(mapState.lat, mapState.lon),
    zoom: mapState.zoom,
    layers: layers[0],
    worldCopyJump: true,
  }).setActiveArea('leaflet-active-area', true);

  // Layers
  // // Layer Heatmap
  const heatmapLayer = new OsmoseHeatmap(itemState, tileQuery);
  mapOverlay['Osmose Issues Heatmap'] = heatmapLayer

  // // Layer Marker
  const featureLayer = L.layerGroup();
  map.addLayer(featureLayer);
  const markerLayer = new OsmoseMarker(mapState, itemState, tileQuery, doc, featureLayer, remoteUrlRead);
  mapOverlay['Osmose Issues'] = markerLayer;

  // Control Layer
  const controlLayers = L.control.layers(mapBases, mapOverlay);
  map.addControl(controlLayers);

  // Widgets
  const scale = L.control.scale({
    position: 'bottomleft',
  });
  map.addControl(scale);

  const location = L.control.location();
  map.addControl(location);

  const geocode = L.Control.geocoder({
    position: 'topleft',
    showResultIcons: true,
  });
  geocode.markGeocode = function(result) {
    this._map.fitBounds(result.geocode.bbox);
    return this;
  };
  map.addControl(geocode);

  const loadingControl = L.Control.loading({
    separate: true,
  });
  map.addControl(loadingControl);

  map.addLayer(markerLayer);

  return [map, markerLayer, heatmapLayer];
}

export { initMap as default };
