import './style.css';
import Map from 'ol/Map.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { Vector as VectorSource } from 'ol/source.js';
import View from 'ol/View.js';
import { ZoomSlider, FullScreen, ScaleLine, defaults as defaultControls } from 'ol/control.js';
import Control from 'ol/control/Control.js';
import Draw from 'ol/interaction/Draw.js';
import { Modify, Snap } from 'ol/interaction.js';
import { get } from 'ol/proj.js';
import OSM from 'ol/source/OSM';
import DragAndDrop from 'ol/interaction/DragAndDrop.js';
import { GPX, GeoJSON, IGC, KML, TopoJSON } from 'ol/format.js';
import { unzipSync } from 'fflate';

const raster = new TileLayer({
  source: new OSM(),
});


const source = new VectorSource();
const vector = new VectorLayer({
  source: source,
  style: {
    'fill-color': 'rgba(255, 255, 255, 0.2)',
    'stroke-color': '#ffcc33',
    'stroke-width': 2,
    'circle-radius': 7,
    'circle-fill-color': '#ffcc33',
  },
});

// Set map extent for world panning
const extent = get('EPSG:3857').getExtent().slice();
extent[0] += extent[0];
extent[2] += extent[2];

// Class for Draw Point Control
class DrawPointControl extends Control {
  constructor() {
    const button = document.createElement('button');
    button.innerHTML = 'M'; // Button text for Point

    const element = document.createElement('div');
    element.className = 'ol-unselectable ol-control draw-point';
    element.appendChild(button);

    super({
      element: element,
    });

    button.addEventListener('click', () => this.handleDraw('Point'), false);
  }

  handleDraw(type) {
    const draw = new Draw({
      source: source,
      type: type,
    });
    map.addInteraction(draw);

    const snap = new Snap({ source: source });
    map.addInteraction(snap);
  }
}

// Class for Draw Line Control
class DrawLineControl extends Control {
  constructor() {
    const button = document.createElement('button');
    button.className = 'draw-control-button';
    button.innerHTML = 'L'; // Button text for Line

    const element = document.createElement('div');
    element.className = 'ol-unselectable ol-control draw-polyline';
    element.appendChild(button);

    super({
      element: element,
    });

    button.addEventListener('click', () => this.handleDraw('LineString'), false);
  }

  handleDraw(type) {
    const draw = new Draw({
      source: source,
      type: type,
    });
    map.addInteraction(draw);

    const snap = new Snap({ source: source });
    map.addInteraction(snap);
  }
}

// Class for Draw Polygon Control
class DrawPolygonControl extends Control {
  constructor() {
    const button = document.createElement('button');
    button.className = 'draw-control-button';
    button.innerHTML = 'P'; // Button text for Polygon

    const element = document.createElement('div');
    element.className = 'ol-unselectable ol-control draw-polygon';
    element.appendChild(button);

    super({
      element: element,
    });

    button.addEventListener('click', () => this.handleDraw('Polygon'), false);
  }

  handleDraw(type) {
    const draw = new Draw({
      source: source,
      type: type,
    });
    map.addInteraction(draw);

    const snap = new Snap({ source: source });
    map.addInteraction(snap);
  }
}

// Class for Draw Circle Control
class DrawCircleControl extends Control {
  constructor() {
    const button = document.createElement('button');
    button.className = 'draw-control-button';
    button.innerHTML = 'C'; // Button text for Circle

    const element = document.createElement('div');
    element.className = 'ol-unselectable ol-control draw-circle';
    element.appendChild(button);

    super({
      element: element,
    });

    button.addEventListener('click', () => this.handleDraw('Circle'), false);
  }

  handleDraw(type) {
    const draw = new Draw({
      source: source,
      type: type,
    });
    map.addInteraction(draw);

    const snap = new Snap({ source: source });
    map.addInteraction(snap);
  }
}

// Create map with individual draw controls
const scaleControl = new ScaleLine({
  units: 'imperial',
});

let zip;

function getKMLData(buffer) {
  zip = unzipSync(new Uint8Array(buffer));
  const kml = Object.keys(zip).find((key) => /\.kml$/i.test(key));
  if (!(kml in zip)) {
    return null;
  }
  return new TextDecoder().decode(zip[kml]);
}

function getKMLImage(href) {
  const index = window.location.href.lastIndexOf('/');
  if (index === -1) {
    return href;
  }
  const image = href.slice(index + 1);
  if (!(image in zip)) {
    return href;
  }
  return URL.createObjectURL(new Blob([zip[image]]));
}

// Define a KMZ format class by subclassing ol/format/KML

class KMZ extends KML {
  constructor(opt_options) {
    const options = opt_options || {};
    options.iconUrlFunction = getKMLImage;
    super(options);
  }

  getType() {
    return 'arraybuffer';
  }

  readFeature(source, options) {
    const kmlData = getKMLData(source);
    return super.readFeature(kmlData, options);
  }

  readFeatures(source, options) {
    const kmlData = getKMLData(source);
    return super.readFeatures(kmlData, options);
  }
}

const map = new Map({
  controls: defaultControls().extend([
    scaleControl,
    new DrawPointControl(),  // Point Draw Control
    new DrawLineControl(),   // Line Draw Control
    new DrawPolygonControl(), // Polygon Draw Control
    new DrawCircleControl(), // Circle Draw Control
    new FullScreen(),
    new ZoomSlider()
  ]),
  layers: [raster, vector],
  target: 'map',
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});

let dragAndDropInteraction;

function setInteraction() {
  if (dragAndDropInteraction) {
    map.removeInteraction(dragAndDropInteraction);
  }
  dragAndDropInteraction = new DragAndDrop({
    formatConstructors: [
      KMZ,
      GPX,
      GeoJSON,
      IGC,
      // use constructed format to set options
      new KML({ extractStyles: true }),
      TopoJSON,
    ],
  });
  dragAndDropInteraction.on('addfeatures', function (event) {
    const vectorSource = new VectorSource({
      features: event.features,
    });
    map.addLayer(
      new VectorLayer({
        source: vectorSource,
      }),
    );
    map.getView().fit(vectorSource.getExtent());
  });
  map.addInteraction(dragAndDropInteraction);
}
setInteraction();

// Modify interaction
const modify = new Modify({ source: source });
map.addInteraction(modify);
