const ejs = require('ejs');
const path = require('path');

async function withinGeofencing(params) {
  return new Promise((resolve, reject) => {
    ejs.renderFile(path.join(__dirname, '../email/within-geofencing.html'), params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

module.exports = withinGeofencing;