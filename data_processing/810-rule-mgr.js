var fs = require('fs');
var path = require("path");

module.exports = function(RED) {

    var filePath = './nodes/core/custom/data_processing/rules/';

    function RoleMgrNode(n) {
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
    RED.nodes.registerType("rule-mgr",RoleMgrNode);



    // get rules file list
    RED.httpAdmin.post('/rulesmgr/getfiles', function (req, res) {


        fs.readdir(filePath, function (err, files) {

            var result = {
                result: false
            };

            var filelist=[];
            if (err == null) {
                files.forEach(function (file) {
                    console.log("%s (%s)", file, path.extname(file));
                    result.result = true;
                    filelist.push(file);
                });
                result.filelist = filelist;
            } else {
                result.content = "file  error";
            }

            res.send(result);
        });
    });
}

