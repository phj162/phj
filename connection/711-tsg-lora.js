module.exports = function (RED) {
    "use strict";

    var zmq = require('zmq');
    var util = require('./799-custom-util.js');
    var mpalMsg = require('./798-mpal-message.js');


    function TsgLoraNode(n) {
        RED.nodes.createNode(this, n);

        var node = this;



        //for(var i in node.wires){
        //    for(var j in node.wires[i]){
        //        node.log("neared node:"+node.wires[i][j]);
        //        var wsnNode = RED.nodes.getNode(String(node.wires[i][j]));
        //        node.log("NODE INF:" + JSON.stringify(wsnNode));
        //    }
        //}

        //var tmpNodeInfo = RED.nodes.node(node.id);







        node.moduleName = "TsgLoraNode";
        node.phyTech = "LoRa";
        node.moduleList = [];

        node.zmqBroker = RED.nodes.getNode(n.zmqBroker);
        node.name = n.name;
        node.interval = n.interval;

        node.log("["+node.moduleName+"]["+n.appId+"]");

        node.log("["+node.moduleName+"][INIT]");
        node.status({fill:"red",shape:"ring",text:"disconnected"});

        if(this.zmqBroker == undefined || this.zmqBroker == null
            || this.zmqBroker.port == undefined || this.zmqBroker.port == null
            || this.zmqBroker.host == undefined || this.zmqBroker.host == null
            || this.interval == undefined || this.interval == null || this.interval === '' || this.interval == 0
        ){
            node.status({fill:"red",shape:"ring",text:"property error"});

            return;
        }

        //var returnMsg = mpalMsg.getPSQString('AP02');
        //console.log("!!!!!!!!!!!!!!!!");
        //console.log(returnMsg);
        //console.log("!!!!!!!!!!!!!!!!");



        node.socket = zmq.socket("req");
        node.socket.on("message", function (message) {
            node.log("["+node.moduleName+"] Received message: " + message.toString("utf8"));

            var parseMsg = mpalMsg.parseMsg(message.toString("utf8"));

            if(parseMsg != null){

                if(parseMsg.header.type === 'RRS'){
                    // App ID 를 할당 받음

                    node.appId = parseMsg.payload;

                    node.socket.send(mpalMsg.getWIQString(node.appId));

                } else if(parseMsg.header.type === 'WIR'){
                    // 설치된 모듈 정보를 가져옴.

                    // WSN Information Response 메시지의 Contents 항목을 파싱한다.
                    mpalMsg.parseWIRContent(parseMsg.payload, function(moduleList){

                        // 각 모듈별로 바인드 쿼리를 날림(해당 appId로 모듈을 사용하겠다는 의미...?)
                        for(var i=0 ; i < moduleList.length ; i++){

                            // 각 노드에 맞는 모듈을 선택적으로 배열에 집어넣는다.
                            if(node.phyTech === moduleList[i].phyTech){
                                node.moduleList.push(moduleList[i])
                            }
                        }

                        for(var i=0 ; i < node.moduleList.length ; i++){
                            node.log("[MODULE-INFO]-" + JSON.stringify(moduleList[i]));
                            node.socket.send(mpalMsg.getWBQString(node.appId, node.moduleList[i].idx));
                        }

                    });


                } else if(parseMsg.header.type === 'WBR'){
                    // 바인드 성공 여부


                    if(parseMsg.payload === '0'){
                        node.log("["+node.moduleName+"][WBR][success]");
                    } else {
                        node.log("["+node.moduleName+"][WBR][error]");
                    }

                } else if(parseMsg.header.type === 'WRM'){
                    // 모듈간의 통신을 담당.

                    var sendMsg = {
                        payload:parseMsg.payload,
                        header:parseMsg.header,
                        broker: {
                            appId : node.appId,
                            host : node.zmqBroker.host,
                            port : node.zmqBroker.port
                        }
                    };
                    node.send(sendMsg);


                } else if(parseMsg.header.type === 'CSR'){
                    // WSN 모듈 설정 여부


                    if(parseMsg.payload === '0'){
                        node.log("["+node.moduleName+"][WBR][success]");
                    } else {
                        node.log("["+node.moduleName+"][WBR][error]");
                    }

                } else if(parseMsg.header.type === 'PSR'){
                    // Profile 설정 여부


                    if(parseMsg.payload === '0'){
                        node.log("["+node.moduleName+"][WBR][success]");
                    } else {
                        node.log("["+node.moduleName+"][WBR][error]");
                    }

                }




                //var publishMsg = {id:node.id ,appId:node.appId};
                //node.log("[TsgLoraNode][publishMsg]"+JSON.stringify(publishMsg));
                //RED.comms.publish("tsg-sun-fsk", publishMsg);


                node.status({fill:"green",shape:"dot",text:"connected"});
            } else {

            }




        });




        setTimeout(function(){
            node.emit("input",{});
        }, 1000);

        this.on("input",function(msg) {
            node.log("[TsgLoraNode][INPUT]");

            node.socket.connect('tcp://'+node.zmqBroker.host+':'+node.zmqBroker.port);


            if(node.appId == null){
                // send RRQ Message
                var appRegMsg = '0000MPLMRRQ0000';
                node.socket.send(appRegMsg);
            }


            node.intervalId = setInterval(function(){
                if(node.appId != null && node.moduleList != null && node.moduleList.length > 0 ){

                    for(var i=0 ; i<node.moduleList.length ; i++){
                        var contentStr = 'REQUEST';

                        var stat = node.socket.send(mpalMsg.getWRMString(node.appId, node.moduleList[i].idx, contentStr));
                        node.log("["+node.moduleName+"][send_msg]"+stat._zmq.pending);
                    }

                }
            }, node.interval);


            node.status({fill:"yellow",shape:"dot",text:"connecting"});
        });


    }

    RED.nodes.registerType("tsg-lora", TsgLoraNode);



    TsgLoraNode.prototype.close = function() {
        var node = this;
        //if(this.sock != undefined && this.sock != null){
        //    this.log("stopping zero-mq client.");
        //    this.sock.close();
        //    this.sock = null;
        //    this.status({fill:"red",shape:"ring",text:"disconnected"});
        //    this.log("stop zero-mq client.");
        //}

        node.log("["+node.moduleName+"][CLOSE]");
        clearInterval(node.intervalId);
        node.socket.close();
        node.status({fill: "red", shape: "ring", text: "disconnected"});
    }



    RED.httpAdmin.get("/tsg-lora/appId/:id", RED.auth.needsPermission("tsg-lora.read"), function(req,res) {
        var node = RED.nodes.getNode(req.params.id);



        if (node != null) {
            node.log("["+node.moduleName+"][http][appId:"+node.appId+"]");

            try {
                var resJson = {appId:node.appId};
                res.json(resJson);
            } catch(err) {
                res.sendStatus(500);
                node.error(RED._("tsg-lora.failed",{error:err.toString()}));
            }
        } else {
            res.sendStatus(404);
        }
    });

    RED.httpAdmin.get("/tsg-lora/moduleList/:id", RED.auth.needsPermission("tsg-lora.read"), function(req,res) {
        var node = RED.nodes.getNode(req.params.id);



        if (node != null) {
            node.log("["+node.moduleName+"][http][appId:"+node.appId+"]");

            try {
                res.json(node.moduleList);
            } catch(err) {
                res.sendStatus(500);
                node.error(RED._("tsg-lora.failed",{error:err.toString()}));
            }
        } else {
            res.sendStatus(404);
        }
    });


}