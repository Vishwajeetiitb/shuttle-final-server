const moment = require('moment');
const _async = require('asyncawait/async');
const _await = require('asyncawait/await');
const TRIP_HISTORY_LENGTH = 20;

const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyDye15iebq9KVelAA9qX-EfzLNgQrpSRQE',
  Promise: Promise
});
// let a =5 ;
exports.snapToRoad = class {
  constructor(RawGpsRef, SnappedGpsRef,googleMapsClient) {
    this.RawGpsRef = RawGpsRef;
    this.SnappedGpsRef = SnappedGpsRef;
    this.googleMapsClient = googleMapsClient;
    this.raw = null;
    this.history = {};
    this.snapped = {};
    this.RawGpsRef.on(
      'value',
      snapshot => {
        _async(() => {
          var raw = snapshot.val();
          this.gatherHistory(raw);
          this.snap();
        })().catch(err => {
          console.error(err);
        });
      },
      errorObject => {
        console.error('The read failed: ' + errorObject.code);
      }
    );
  }
  gatherHistory(raw) {
    this.raw = raw;
    if (raw) {
      const tripnames = new Set(Object.keys(raw));
      tripnames.forEach(tripname => {
        if (!this.history[tripname]) {
          this.history[tripname] = [];
        }
        // console.log(tripname); 
        let data_string = raw[tripname].gps_raw.split(" ");
        const point = {
          lat: data_string[0] / 1000000,
          lng: data_string[1] / 1000000
        };
        this.history[tripname].push(point);
        if (this.history[tripname].length > TRIP_HISTORY_LENGTH) {
          this.history[tripname] = this.history[tripname].slice(
            -TRIP_HISTORY_LENGTH
          );
        }
      });
    }
  }

  snap() {
    const rawSnapshot = this.raw;
    if (rawSnapshot) {
      const tripnames = new Set(Object.keys(rawSnapshot));
      tripnames.forEach(tripname => {
        const path = this.history[tripname].map(point => {
          return [point.lat, point.lng];
        });
        const result = _await(
          this.googleMapsClient.snapToRoads({path}).asPromise()
        );
        if (result.json.snappedPoints) {
          this.snapped[tripname] =
            result.json.snappedPoints[
              result.json.snappedPoints.length - 1
            ].location;
        } else {
          console.error(result);
          this.snapped[tripname] = {};
        }
      });
    
      this.SnappedGpsRef.set(this.snapped);
    //   console.log(this.history);
 
    }
  }
};
