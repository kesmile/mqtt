var mqtt = require('mqtt')
var client_Id = 'mqttjs_' + Math.random().toString(16).substr(2, 8);

var host = 'mqtt://localhost:1883';

var options = {
    keepalive: 10,
    clientId: client_Id,
    username: 'admin',
    password: '1234',
};

var client = mqtt.connect(host, options);

client.on('connect', function () {
  client.subscribe('/World');
  client.publish('/World', 'Hello mqtt');
});

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString());
});
setInterval(function(){
  client.publish('/World', 'Hello mqtt ' + Math.random().toString(16).substr(2, 8));
}, 10000);
