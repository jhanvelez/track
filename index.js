const gpstracker = require("gpstracker");
const geolib = require('geolib');
const nodemailer = require('nodemailer');

const http = require("https");
const btoa = require("btoa");

const db = require('./config/db');
const GPS = require('./models/gpstracker.model');
const Geocerca = require('./models/geocerca.model');
const renderHtmlEmails = require('./controllers/renderHtmlEmails');

// Email API
let transporter = nodemailer.createTransport({
  service: 'gmail', // puedes usar otros servicios como 'hotmail', 'yahoo', etc.
  auth: {
    user: 'tucorreo@gmail.com', // reemplaza con tu correo
    pass: 'tucontraseña' // reemplaza con tu contraseña
  }
});

// Geocerga group
let geofences = [];

Geocerca.findAll()
  .then(geocercas => {
    geofences = geocercas.map(geocerca => {
      return {
        name: geocerca.name,
        coordinates: geocerca.longitudes.map(coordinate => ({ // Aquí está la corrección
          latitude: coordinate.lat,
          longitude: coordinate.lng
        }))
      };
    });
    console.log(geofences);
  })
  .catch(err => {
    console.error('Error al obtener geocercas:', err);
  });


//SMS API
var options = {
  "method": "POST",
  "hostname": "api.labsmobile.com", // Aquí está la corrección
  "path": "/json/send", // Aquí está la corrección
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Basic " + btoa("myusername:mypassword"),
    "Cache-Control": "no-cache"
  }
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});


db.sync()
  .then(() => console.log("Conectado al servidor"))
  .catch(err => console.log(err));

const server = gpstracker.create().listen(4122, function () {
  console.log('Escuchando los dispositivos GPS en el puerto', 4122);
});

server.trackers.on("connected", function (tracker) {
  console.log("Dispositivo conectado con IMEI:", tracker.imei);

  tracker.on("help me", function () {
    console.log(tracker.imei + " ha presionado el botón de ayuda!!");
  });

  tracker.on("position", async function (position) {
    console.log("Dispositivo {" + tracker.imei + "}: lat", position.lat, "lng", position.lng);

    const { imei, date, time, lng, lat, speed } = position;

    try {
      await GPS.create({ imei, track_date: date, track_time: time, track_lng: lng, track_lat: lat, speed });
      console.log("Datos de posición almacenados en la base de datos");
    } catch (error) {
      console.error("Error al almacenar datos en la base de datos:", error);
    }

    if (speed > 80) {
      //enviar mensaje de texto
      req.write(JSON.stringify({ message: 'Alerta! La velocidad ha superado los 80 km/h',
        tpoa: 'Sender',
        recipient:[
          { msisdn: '573228148914' },
          { msisdn: '573122348970' },
        ]
      }));
      req.end();

      //enviar correo electrónico
      renderHtmlEmails(params).then(html => {
        let mailOptions = {
          from: 'tucorreo@gmail.com',
          to: 'destinatario@gmail.com',
          subject: 'Prueba de envío de correo con Node.js',
          html: html
        };
      
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Correo enviado: ' + info.response);
          }
        });
      }).catch(console.error);
    }

    //Verificamos la posicion de la geocerca
    for (let geofence of geofences) {
      // Verifica si la posición está dentro de la geocerca
      let isInside = geolib.isPointInside(
        {latitude: position.lat, longitude: position.lng},
        geofence.coordinates
      );
  
      if (isInside) {
        // enviar mensaje de texto
        req.write(JSON.stringify({ message: `El vehiculo se encuentra dentro de una geocerca`,
          tpoa: 'Sender',
          recipient:[
            { msisdn: '573228148914' },
            { msisdn: '573122348970' },
          ]
        }));
        req.end();

        // enviar correo electrónico
        renderHtmlEmails(params).then(html => {
          let mailOptions = {
            from: 'tucorreo@gmail.com',
            to: 'destinatario@gmail.com',
            subject: 'Prueba de envío de correo con Node.js',
            html: html
          };
        
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Correo enviado: ' + info.response);
            }
          });
        }).catch(console.error);

        console.log(`La posición está dentro de la geocerca: ${geofence.name}`);
        break; // Si la posición está dentro de una geocerca, no necesitamos verificar las demás
      }
    }
  });

  // Configuración para realizar un seguimiento cada 2 minutos
  tracker.trackEvery(2).minutes();
});
