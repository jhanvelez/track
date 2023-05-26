// const express = require('express');

// // Crear una app de express
// const app = express();

// app.listen(7000);

var gps = require("gps-tracking");

var options = {
    'debug': true,
    'port': 4122,
    'device_adapter': "TK103"
}

var server = gps.server(options, function (device, connection) {
    connection.on("data",function(req, res){
		//When raw data comes from the device
        console.log("When raw data comes from the device", req.toString());
        console.log("req: ", req);
        console.log("res: ", res.toString);
	});
    /*	Available device variables:
        ----------------------------
        device.uid -> Set when the first packet is parsed
        device.name -> You can set a custon name for this device.
        device.ip -> IP of the device
        device.port --> Device port
    */

    /******************************
    LOGIN
    ******************************/
    device.on("login_request", function (device_id, msg_parts) {
        //Do some stuff before authenticate the device...
        // This way you can prevent from anyone to send their position without your consent
        console.log('device: ', device_id.toString());
        console.log('msg: ', msg_parts.toString()); 
        this.login_authorized(true); //Accept the login request.
    });

    device.on("login", function () {
        console.log("Hi! i'm " + device.uid);
    });

    device.on("login_rejected", function () {
        console.log("Login rejected")
    });


    /******************************
    PING - When the gps sends their position  
    ******************************/
    device.on("ping", function (data) {
        //After the ping is received
        //console.log(data);
        console.log("I'm here now: " + gps_data.latitude + ", " + gps_data.longitude);
        return data;
    });

});

server.setDebug(true);