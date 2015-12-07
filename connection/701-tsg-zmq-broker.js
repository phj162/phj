module.exports = function (RED) {
    "use strict";

    var zmq = require('zmq');

    function ZmqBrokerNode(n) {
        RED.nodes.createNode(this,n);
        var node = this;

        this.host = n.host;
        this.port = n.port;
        this.isConnected = false;


        node.log("[ZMQ-INIT]");



        setTimeout(function(){
            node.emit("input",{});
        }, 1000);


        this.on("input",function(msg) {
            node.log("[ZMQ-INPUT]");


            node.status({fill:"green",shape:"dot",text:"connected"});
        });



    }

    RED.nodes.registerType("zmq-broker",ZmqBrokerNode);


    ZmqBrokerNode.prototype.close = function(){
        var node = this;

        node.log("[ZMQ-CLOSE]");
    }




}