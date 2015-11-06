module.exports = function (RED) {
    var zmq = require('zmq');

    function ZmqServerNode(config) {
        RED.nodes.createNode(this, config);

        var node = this;
        this.on('input', function (msg) {
            var thisObj = this;
            this.log("[TEST]");

            var responder = zmq.socket('push');

            var port = 5555;


            /**
             responder.on('message', function(request) {
  console.log("Received request: [", request.toString(), "]");

  // do some 'work'
  setInterval(function() {
    console.log("[server] send message.");
    // send reply back to client.
    responder.send("0123456789");
  }, 2000);
});

             responder.bind('tcp://*:'+port, function(err) {
  if (err) {
    thisObj.log(err);
  } else {
    thisObj.log("Listening on "+port+"…");
  }
});

             process.on('SIGINT', function() {
  responder.close();
});
             */

            var idx = 0;
            responder.bindSync('tcp://*:'+port);

//responder.on('accept', function(fd, ep){

            setInterval(function() {
                console.log("[server] send message.");
                // send reply back to client.
                responder.send("0123456789-"+(idx++));
            }, 2000);

//});

//setInterval(function() {
//    console.log("[server] send message.");
            // send reply back to client.
//    responder.send("0123456789-"+(idx++));
//}, 2000);



            this.on('close', function(done) {
                this.log("stopping zero-mq server.");
                responder.close();
                this.log("stop zero-mq server.");
            });


        });
    }

    RED.nodes.registerType("zmq-server", ZmqServerNode);
}