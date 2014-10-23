/*jslint node:true,vars:true, unparam:true */
/*jshint unused:true */


/*
The Touch Notifier Node.js sample application distributed within Intel® XDK IoT Edition under the IoT with Node.js Projects project creation option showcases how to read digital data from a Grover Starter Kit Plus – IoT Intel® Edition Touch Sensor, start a web server and communicate wirelessly using WebSockets.

MRAA - Low Level Skeleton Library for Communication on GNU/Linux platforms
Library in C/C++ to interface with Galileo & other Intel platforms, in a structured and sane API with port nanmes/numbering that match boards & with bindings to javascript & python.

Steps for installing MRAA & UPM Library on Intel IoT Platform with IoTDevKit Linux* image
Using a ssh client: 
1. echo "src maa-upm http://iotdk.intel.com/repos/1.1/intelgalactic" > /etc/opkg/intel-iotdk.conf
2. opkg update
3. opkg upgrade

Article: https://software.intel.com/en-us/html5/articles/iot-touch-notifier-nodejs-and-html5-samples
*/

//MRAA Library was installed on the board directly through ssh session
var mraa = require("mraa");
var border_num=30;//1 second
var border_letter_space_num=90;//3 second
//var border_send_num=151;//5 seconds
var current_index=0;

var current_zero_times=0;
var last_char=".";

//GROVE Kit Shield D6 --> GPIO6
//GROVE Kit Shield D2 --> GPIO2
function startSensorWatch(socket) {
    'use strict';
    var touch_sensor_value = 0, last_t_sensor_value;

    //Touch Sensor connected to D2 connector
    var digital_pin_D8 = new mraa.Gpio(8);
    digital_pin_D8.dir(mraa.DIR_IN);

    //Buzzer connected to D6 connector
    var digital_pin_D6 = new mraa.Gpio(6);
    digital_pin_D6.dir(mraa.DIR_OUT);

    digital_pin_D6.write(0);
    
          socket.on('new message', function (data) {
                console.log('from server:');
                console.log(data);
              if(data && data.message){
                  var val_server=parseInt(data.message, 10);                  
                digital_pin_D6.write(val_server);
              }
            });

    setInterval(function () {
        touch_sensor_value = 1 - digital_pin_D8.read();
        //console.log(touch_sensor_value);
        if (touch_sensor_value === 1 && last_t_sensor_value === 0) {
            current_zero_times=0;
            current_index++;
            //console.log("current index:"+current_index);
    
            //console.log("Buzz ON!!!");
            socket.emit('new message', "1");
            //digital_pin_D6.write(touch_sensor_value);
        }
        if (touch_sensor_value === 1 && last_t_sensor_value === 1) {
            current_zero_times=0;
            current_index++;
            //console.log("current index:"+current_index);
    
            //console.log("Buzz ON!!!");
            
            //digital_pin_D6.write(touch_sensor_value);
        }
        else if (touch_sensor_value === 0 && last_t_sensor_value === 1) {
            current_zero_times=0;
            if(current_index>0){
//                if(current_index>=border_send_num)
//                {
//                    last_char="s";
//                    console.log(last_char);
//                }
//                else 
//                if(current_index>=border_letter_space_num)
//                {
//                    last_char=" ";
//                    console.log(last_char);
//
//                }
//                else 
                if(current_index>=border_num){
                    
                    last_char="-";
                    console.log(last_char);
                }
                else if(current_index<border_num){
                    last_char=".";
                    console.log(last_char);
                }
                socket.emit('morse_code', last_char);
            }
            current_index=0;
            
            socket.emit('new message', "0");
            //digital_pin_D6.write(touch_sensor_value);
        }
        else if (touch_sensor_value === 0 && last_t_sensor_value === 0) {
            current_zero_times++;
            if(current_zero_times>border_letter_space_num)
            {
                last_char=" ";
                socket.emit('morse_code', last_char);  
                current_zero_times=0;
            }
        }
        last_t_sensor_value = touch_sensor_value;        
    }, 33);
}

//startSensorWatch(null);
/*
//Create Socket.io server
var http = require('http');
var app = http.createServer(function (req, res) {
    'use strict';
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('<h1>Hello world from Intel IoT platform!</h1>');
}).listen(1337);
var io = require('socket.io')(app);

console.log("Sample Reading Touch Sensor");

//Attach a 'connection' event handler to the server
io.on('connection', function (socket) {
    'use strict';
    console.log('a user connected');
    //Emits an event along with a message
    socket.emit('connected', 'Welcome');

    //Start watching Sensors connected to Galileo board
    startSensorWatch(socket);

    //Attach a 'disconnect' event handler to the socket
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

*/

var socket = require('socket.io-client')('http://192.168.111.100:3000');
  socket.on('connect', function(){
    socket.on('event', function(data){});
    socket.on('disconnect', function(){});
	// Tell the server your username
    socket.emit('add user', 'edison');
	  // Whenever the server emits 'login', log the login message
	  socket.on('login', function (data) {
		connected = true;
		// Display the welcome message
		var message = "Welcome to Socket.IO Chat ? ";
		console.log(message);
		console.log('from server:');
		console.log(data);
          startSensorWatch(socket);
        
              
	  });
	  
	    // Whenever the server emits 'user joined', log it in the chat body
  socket.on('user joined', function (data) {
    console.log(data.username + ' joined');
    console.log('from server:');
		console.log(data);

  });
//      socket.on('new message', function (data) {
//                console.log('from server:');
//                console.log(data);
//            });
  
      
  });