module.exports = function (RED) {
    "use strict";

    var zmq = require('zmq');


    function TsgSunFskNode(n) {
        RED.nodes.createNode(this, n);

        var node = this;

        this.zmqBroker = RED.nodes.getNode(n.zmqBroker);
        this.name = n.name;
        this.interval = n.interval;

        node.log("[TsgSunFskNode][AppID]"+ n.appId);



        var node = this;
        node.log("[TsgSunFskNode][INIT]");
        node.status({fill:"red",shape:"ring",text:"disconnected"});


        node.log(JSON.stringify(node.zmqBroker));

        if(this.zmqBroker == undefined || this.zmqBroker == null
            || this.zmqBroker.port == undefined || this.zmqBroker.port == null
            || this.zmqBroker.host == undefined || this.zmqBroker.host == null
            || this.interval == undefined || this.interval == null || this.interval === '' || this.interval == 0
        ){
            node.status({fill:"red",shape:"ring",text:"property error"});

            return;
        }



        node.socket = zmq.socket("req");
        node.socket.on("message", function (message) {
            node.log("Received message: " + message.toString("utf8"));




        });




        setTimeout(function(){
            node.emit("input",{});
        }, 1000);

        this.on("input",function(msg) {
            node.log("[TsgSunFskNode][INPUT]");

            node.socket.connect('tcp://'+node.zmqBroker.host+':'+node.zmqBroker.port);





            node.intervalId = setInterval(function(){

                if(node.appId != null){
                    var stat = node.socket.send(node.appId+"-test2");
                    node.log('[send_msg]'+stat._zmq.pending);
                } else {
                    node.log('[send_msg_err] app id null');
                    var appRegMsg = '0000MPLMRRQ0000';
                    node.socket.send(appRegMsg);
                }


            }, node.interval);


            node.status({fill:"yellow",shape:"dot",text:"connecting"});
        });


    }

    RED.nodes.registerType("tsg-sun-fsk", TsgSunFskNode);



    TsgSunFskNode.prototype.close = function() {
        var node = this;
        //if(this.sock != undefined && this.sock != null){
        //    this.log("stopping zero-mq client.");
        //    this.sock.close();
        //    this.sock = null;
        //    this.status({fill:"red",shape:"ring",text:"disconnected"});
        //    this.log("stop zero-mq client.");
        //}

        node.log("[TsgSunFskNode][CLOSE]");

        clearInterval(node.intervalId);
        node.socket.close();
        //node.appId = null;
        node.status({fill:"red",shape:"ring",text:"disconnected"});
    }






    RED.httpAdmin.get("/tsg-sun-fsk/:id", RED.auth.needsPermission("tsg-sun-fsk.read"), function(req,res) {
        var node = RED.nodes.getNode(req.params.id);



        if (node != null) {
            node.log("[tsg-sun-fsk][http][appId:"+node.appId+"]");

            try {
                var resJson = {appId:node.appId};
                res.json(resJson);
            } catch(err) {
                res.sendStatus(500);
                node.error(RED._("tsg-sun-fsk.failed",{error:err.toString()}));
            }
        } else {
            res.sendStatus(404);
        }
    });


}