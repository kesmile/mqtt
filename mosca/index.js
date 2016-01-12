var mosca = require('mosca');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mosca');
var User = mongoose.model('User', { username: String, password: String, status: Boolean });
var mongo_mosca = {
  //using ascoltatore
  type: 'mongo',
  url: 'mongodb://localhost:27017/mqtt',
  pubsubCollection: 'mosca',
  mongo: {}
};
var moscaSetting = {
    interfaces: [
        { type: "mqtt", port: 1883 },
        { type: "http", port: 3000, bundle: true }
    ],
    stats: false,
    logger: { name: 'MoscaServer'
      //, level: 'debug'
    },
    backend: mongo_mosca,
};

var authenticate = function (client, username, password, callback) {

  User.findOne({ username: username }, function(err,user){
      if (err){
        callback(null, false);
        return console.error(err);
      }
      console.log(user);
      if (username == user.username && password.toString() == user.password){
          callback(null, true);
      }else{
          callback(null, false);
      }
  });

}

var authorizePublish = function (client, topic, payload, callback) {
    callback(null, true);
}

var authorizeSubscribe = function (client, topic, callback) {
    callback(null, true);
}

var server = new mosca.Server(moscaSetting);

server.on('ready', setup);

function setup() {
    server.authenticate = authenticate;
    server.authorizePublish = authorizePublish;
    server.authorizeSubscribe = authorizeSubscribe;

    console.log('Mosca server is up and running.');
}

server.on("error", function (err) {
    console.log(err);
});

server.on('clientConnected', function (client) {
    console.log('Client Connected \t:= ', client.id);
});

server.on('published', function (packet, client) {
    console.log("Published :=", packet);
});

server.on('subscribed', function (topic, client) {
    console.log("Subscribed :=", topic);
});

server.on('unsubscribed', function (topic, client) {
    console.log('unsubscribed := ', topic);
});

server.on('clientDisconnecting', function (client) {
    console.log('clientDisconnecting := ', client.id);
});

server.on('clientDisconnected', function (client) {
    console.log('Client Disconnected     := ', client.id);
});
