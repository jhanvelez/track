var gpstracker = require("gpstracker");

// Crear la conexión a la BD
const db = require('./config/db');

// Importar controlador
// const GPS = require('./controllers/gpstracker.controller');
const GPS = require('./models/gpstracker.model');

//db.authenticate()
db.sync()
    .then(() => console.log("Conectado al servidor"))
    .catch(err => console.log(err));

var server = gpstracker.create().listen(4122, function(){
   console.log('listening your gps trackers on port', 4122);
});

server.trackers.on("connected", function(tracker){

  console.log("tracker connected with imei:", tracker.imei);

  tracker.on("help me", function(){
    console.log(tracker.imei + " pressed the help button!!".red);
  });

  tracker.on("position", async function(position){
    console.log("tracker {" + tracker.imei +  "}: lat",
                        position.lat, "lng", position.lng);
    
    // GPS.NuevoGPS(position);
    const {imei, date, time, lng, lat, speed} = position;
    await GPS.create({imei: imei, track_date: date, track_time: time, track_lng: lng, track_lat: lat, speed: speed});
  });


  
  // tracker.trackEvery(1).hours();
  tracker.trackEvery(1).minutes();
  // tracker.trackEvery(10).seconds();

//   setTimeout(() => {
//     tracker.getPosition();  
//   }, 5000);
});

