/*eslint-disable unknown-require */
const trackerConfig = require('./tracker_configuration.json');

const Promise = require('bluebird');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const googleMapsClient = require('@google/maps').createClient({
  key: trackerConfig.mapsApiKey,
  Promise
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: trackerConfig.databaseURL
});

// Database references
const panelsRef = admin.database().ref('panels');
const timeRef = admin.database().ref('current-time');
// const GpsRef = admin.database().ref('e-shuttle-gps-data');
const RawGpsRef = admin.database().ref('e-shuttle-raw-gps');
const SnappedGpsRef = admin.database().ref('e-shuttle-snapped-gps');

// Library classes
const {HeartBeat} = require('./heart_beat.js');
const {ReadData} = require('./read_data.js');
const {snapToRoad} = require('./snap_to_road.js');

new HeartBeat(timeRef, trackerConfig.simulation);
new snapToRoad(RawGpsRef, SnappedGpsRef, googleMapsClient);
new ReadData(RawGpsRef);
