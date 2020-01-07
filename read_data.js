/* eslint-disable unknown-require */
const moment = require('moment');
const _async = require('asyncawait/async');
const _await = require('asyncawait/await');

const DATE_FORMAT = 'YYYYMMDD HH:mm:ss';

// TimeTable listens for updates on `GpsRef`, and then publishes updated
// time table information on `panelsRef`, using `gtfs` as a source of
// next trips, `panelConfig` for the grouping of routes to panels, and
// `googleMapsClient` to access Directions API for Predicted Travel Times.
exports.ReadData = class {
  constructor(RawGpsRef) {
    this.RawGpsRef = RawGpsRef;

    this.RawGpsRef.on(
      'value',
      snapshot => {
        _async(() => {
          let a = snapshot.val().E1.gps_raw;
          let b = a.split(' ');
          console.log(b[1] / 10000);
        })().catch(err => {
          console.error(err);
        });
      },
      errorObject => {
        console.error('The read failed: ' + errorObject.code);
      }
    );
  }
};
