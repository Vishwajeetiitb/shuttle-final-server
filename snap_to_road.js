const moment = require('moment');
const _async = require('asyncawait/async');
const _await = require('asyncawait/await');

const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyDye15iebq9KVelAA9qX-EfzLNgQrpSRQE',
  Promise: Promise
});
// let a =5 ;
exports.snapToRoad = class {
  constructor(RawGpsRef, SnappedGpsRef) {
    this.RawGpsRef = RawGpsRef;
    this.SnappedGpsRef = SnappedGpsRef;
    var raw_dataset;
    var initial = true;
    console.log(initial);
    console.log('hey! this will snap to road');
    this.RawGpsRef.on(
      'value',
      snapshot => {
        _async(() => {
          var raw = snapshot.val().E1;
          //raw dataset is made to store last 10 gps values so that snap to road will be more relible
          if (initial) {
            raw_dataset = [raw, raw, raw, raw, raw, raw, raw, raw, raw, raw];
          } else {
            for (var i = 0; i < 9; i++) {
              raw_dataset[i] = raw_dataset[i + 1];
            }
            raw_dataset[9] = raw;
          }
          // raw_dataset = [raw, raw, raw, raw, raw, raw, raw, raw, raw, raw];
          // console.log(raw_dataset);
          initial = this.snap(raw_dataset); // here we snap data to road
          // this.GpsRefSnap.set({Real: a});
          // console.log(initial);
        })().catch(err => {
          console.error(err);
        });
      },
      errorObject => {
        console.error('The read failed: ' + errorObject.code);
      }
    );
  }
  snap(raw_datasets) {
    this.raw_datasets = raw_datasets;
    const p = this.raw_datasets.map(point => {
      return [point.lat, point.lng];
    });
    console.log(p);
    googleMapsClient
      .snapToRoads({
        path: p
      })
      .asPromise()
      .then(response => {
        this.SnappedGpsRef.set(response.json.snappedPoints);
      })
      .catch(err => console.log(err));

    return false;
  }
};
