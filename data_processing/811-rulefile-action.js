var fs = require('fs');
var path = require("path");

module.exports = function(RED) {

    var filePath = './nodes/core/custom/data_processing/rules/';

    function RoleFileActionNode(n) {
        RED.nodes.createNode(this,n);
        var node = this;

        this.on("input", function(msg) {
            if (msg.hasOwnProperty("payload")) {
                msg.payload = "Not yet Impl";
                node.send(msg);
            }
            else { node.send(msg); } // If no payload - just pass it on.
        });
    }
    RED.nodes.registerType("rulefile",RoleFileActionNode);

}

