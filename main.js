import 'ol/ol.css';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import XYZ from 'ol/source/XYZ';
import {ZoomSlider} from 'ol/control';
import OSM from 'ol/source/OSM';
import Stamen from 'ol/source/Stamen';
import { ZoomToExtent } from 'ol/control';

import 'ol-ext/control/Permalink.css';
import 'ol-ext/control/Search.css';
import 'ol-ext/control/Swipe.css';
import Permalink from 'ol-ext/control/Permalink';
import SearchNominatim from 'ol-ext/control/SearchNominatim';
import Swipe from 'ol-ext/control/Swipe';
import Clip from 'ol-ext/interaction/Clip';

const key = 'lNLOeGvrpggkSB6qixJ8';
const attributions =
  '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
  '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';

const roadLayer = new TileLayer({
  source: new XYZ({
    attributions: attributions,
    url: 'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=' + key,
    crossOrigin: 'anonymous',
    tileSize: 512,
    maxZoom: 22,
  })
});

const aerialLayer = new TileLayer({
  source: new XYZ({
    attributions: attributions,
    url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + key,
    crossOrigin: 'anonymous',
    maxZoom: 20
  }),
});

const view = new View({
  center: [-6655.5402445057125, 6709968.258934638],
  minZoom: 0,
  maxZoom: 15,
  zoom: 3,
});

const stam = new TileLayer({
  source: new Stamen({
    layer: 'watercolor'
  })
});

const map1 = new Map({
  target: 'roadMap',
  layers: [roadLayer, stam],
  view: view,
});

const map2 = new Map({
  target: 'aerialMap',
  layers: [aerialLayer],
  view: view,
});

const zoomSlider1 = new ZoomSlider();
const zoomSlider2 = new ZoomSlider();
map1.addControl(zoomSlider1);
map2.addControl(zoomSlider2);

// ol-ext
const osm = new TileLayer({
  source: new OSM()
});

const stamen = new TileLayer({
  source: new Stamen({
    layer: 'watercolor'
  })
});

const label = new TileLayer({
  source: new Stamen({
    layer: 'terrain-labels'
  })
});

const map = new Map({
  target: 'map',
  layers: [osm, stamen, label],
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});

const control = new Swipe();
control.addLayer(stamen);
control.addLayer(osm, true);
map.addControl(control);

map.addControl(new Permalink);

const search = new SearchNominatim();
search.on('select', (e) => {
  map.getView().animate({
    center: e.coordinate,
    zoom: 14
  })
})
map.addControl(search);


map.addControl(new ZoomToExtent({
  extent: [
    3050966.7764391196, 7138502.977932157,
    3083142.2302924343, 7164744.840218453
  ]
}));

const clip = new Clip({
  radius: 100,
  layers: stam
});
map1.addInteraction(clip);
