/**
 * Created by Jung on 2015-11-24.
 */

var fs = require('fs');

module.exports = function (RED) {
    var filePath = './nodes/core/custom/data_processing/rules/';

    function RulesNode(n) {
        RED.nodes.createNode(this, n);
        this.fileName = n.fileName || '';
        this.roadRules = null;

        var node = this;
        this.on('input', function (msg) {
            var outputArr = [];

            try {
                var msgJson = JSON.parse(msg.payload);
                for (var i in node.roadRules) {
                    if (ruleCheck(node.roadRules[i], msgJson)) {
                        outputArr.push(msg);
                    } else {
                        outputArr.push(null);
                    }
                }

                this.send(outputArr);
            } catch (e) {
                node.status({fill: 'red', shape: 'dot', text: 'Not JSON Msg'});
            }
        });

        // 초기 세팅
        fs.readFile(filePath + node.fileName, function (err, data) {
            if (err == null) {
                node.roadRules = JSON.parse(data.toString());
                node.status({fill: 'green', shape: 'dot', text: 'Rules Setting Succes'});
            } else {
                node.status({fill: 'red', shape: 'dot', text: 'Not Found File'});
            }
        });

        function ruleCheck(aJson, bJson) {
            var flag = true;

            for (var key in aJson) {
                if (!bJson.hasOwnProperty(key)) {
                    flag = false;
                } else {
                    if (typeof aJson[key] === typeof bJson[key]) {
                        if (typeof aJson[key] === 'object') {
                            if (Array.isArray(aJson[key])) {
                                for (var index in aJson[key]) {
                                    if (!ruleCheck(aJson[key][index], bJson[key][index])) {
                                        flag = false;
                                    }
                                }
                            } else {
                                if (!ruleCheck(aJson[key], bJson[key])) {
                                    flag = false;
                                }
                            }
                        }
                    } else {
                        flag = false;
                    }
                }
            }

            return flag;
        }
    }

    RED.nodes.registerType('standard-rules', RulesNode);

    RED.httpAdmin.post('/standardRules/:fileName', function (req, res) {
        fs.readFile(filePath + req.params.fileName, function (err, data) {
            var result = {
                result: false
            };

            if (err == null) {
                var tmpRules = JSON.parse(data.toString());
                result.result = true;
                result.value = tmpRules.length;
            }

            res.send(result);
        });
    });
};