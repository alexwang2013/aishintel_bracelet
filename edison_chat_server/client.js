var socket = require('socket.io-client')('http://localhost:3000');
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
	  });
	  
	    // Whenever the server emits 'user joined', log it in the chat body
  socket.on('user joined', function (data) {
    console.log(data.username + ' joined');
    console.log('from server:');
		console.log(data);
  });
  });