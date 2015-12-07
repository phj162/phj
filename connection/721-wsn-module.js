module.exports = function (RED) {
    "use strict";

    var zmq = require('zmq');


    function WsnModule(n) {
        RED.nodes.createNode(this, n);

        var node = this;
        this.name = n.name;
        node.moduleName = "TsgLoraNode";
        node.wsnName = n.wsnName;
        node.log("["+node.moduleName+"][INIT]");








        setTimeout(function(){
            node.emit("input",{});
        }, 1000);

        this.on("input",function(msg) {
            node.log("["+node.moduleName+"][INPUT]["+JSON.stringify(msg)+"]");

            if(msg != null && msg.header != null && msg.header.source != null && msg.header.source == node.wsnName){
                node.send(msg);
            }
        });


    }

    RED.nodes.registerType("wsn-module", WsnModule);



    WsnModule.prototype.close = function() {
        var node = this;
        node.log("["+node.moduleName+"][CLOSE]");

    }




}