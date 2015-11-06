module.exports = function (RED) {
    var zmq = require('zmq');

    function ZmqClientNode(n) {

        RED.nodes.createNode(this, n);
        this.log("ZMQ-CLIENT");
        var node = this;



        node.status({fill:"red",shape:"ring",text:"disconnected"});

        node.log('host:'+ n.host);
        node.log('port:'+ n.port);


        this.host = n.host;
        this.port = n.port;


        try{
            if(this.host === undefined || this.host === null){
                this.host='localhost';
            }
            if(this.port === undefined || this.port === null){
                this.port = 5555;
            }


            setTimeout(function(){

                node.log("client connection.....");
                var sock = zmq.socket('pull');
                var sss = sock.connect('tcp://'+node.host+':'+node.port);

                node.log(sss);

                node.status({fill:"green",shape:"dot",text:"connected"});

                sock.on('message', function(msg){
                    node.log("[client]"+msg.toString());


                    var sendMsg = {payload:msg.toString()};
                    node.send(sendMsg);
                });

                node.log("client connected...");

            }, 5000);

        } catch(err) {
            node.log("[zmq-client error]"+err);
        }


        this.on('close', function(done) {
            this.log("stopping zero-mq client.");
            node.status({fill:"red",shape:"ring",text:"disconnected"});
            this.log("stop zero-mq client.");
        });





    }

    RED.nodes.registerType("zmq-client", ZmqClientNode);
}