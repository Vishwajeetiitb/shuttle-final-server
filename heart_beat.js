/* eslint-disable no-undef-expression */
const moment = require('moment');

const DATE_FORMAT = 'YYYYMMDD HH:mm:ss';

// HeartBeat generates a stream of updates to `timeRef`, with either
// simulated time updates, or real time updates, depending on the
// truthyness of `simulatedTime`
exports.HeartBeat = class {
  constructor(timeRef, simulatedTime) {
    this.timeRef = timeRef;
    this.simulated = simulatedTime;

    // Update the time once a second
    this.timeTimerId = setInterval(() => {
      this.timeAdvance();
    }, 1000);
  }

  timeAdvance() {
    const now = moment();
    this.timeRef.set({
      display: now.format('h:mm:ss A, MMM Do')
      //   moment: now.valueOf()
    });
  }
};
