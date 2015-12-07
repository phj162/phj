/**
 * Created by Jung on 2015-11-24.
 */

var fs = require('fs');

module.exports = function (RED) {
    var filePath = './nodes/core/custom/data_processing/rules/';
    var operators = {
        'eq': function (a, b) {
            return a == b;
        },
        'neq': function (a, b) {
            return a != b;
        },
        'lt': function (a, b) {
            return a < b;
        },
        'lte': function (a, b) {
            return a <= b;
        },
        'gt': function (a, b) {
            return a > b;
        },
        'gte': function (a, b) {
            return a >= b;
        },
        'btwn': function (a, b, c) {
            return a >= b && a <= c;
        },
        'cont': function (a, b) {
            return (a + "").indexOf(b) != -1;
        },
        'regex': function (a, b, c, d) {
            return (a + "").match(new RegExp(b, d ? 'i' : ''));
        },
        'true': function (a) {
            return a === true;
        },
        'false': function (a) {
            return a === false;
        },
        'null': function (a) {
            return (typeof a == "undefined" || a === null);
        },
        'nnull': function (a) {
            return (typeof a != "undefined" && a !== null);
        },
        'else': function (a) {
            return a === true;
        }
    };

    function RulesNode(n) {
        RED.nodes.createNode(this, n);
        this.fileName = n.fileName || '';
        this.ruleId = n.ruleId || '';

        var node = this;
        this.on('input', function (msg) {
            var outputArr = [];

            for (var i in rule.outputs) {
                if (rule.outputs[i].operator != undefined) {
                    var rMsg = null;
                    if (operators[rule.outputs[i].operator](msg[rule.property], rule.outputs[i].value)) {
                        rMsg = {
                            payload: msg[rule.property]
                        };
                    }

                    outputArr.push(rMsg);
                }
            }

            this.send(outputArr);
        });

        // 초기 설정값 끌어오기
        var rule = null;
        fs.readFile(filePath + node.fileName, function (err, data) {
            if (err == null) {
                var tmpRules = JSON.parse(data.toString());
                for (var i in tmpRules) {
                    if (tmpRules[i].id == node.ruleId) {
                        rule = tmpRules[i];
                    }
                }
            }
        });
    }

    RED.nodes.registerType('rules', RulesNode);

    RED.httpAdmin.post('/rules/:fileName', function (req, res) {
        fs.readFile(filePath + req.params.fileName, function (err, data) {
            var result = {
                result: false
            };

            if (err == null) {
                result.result = true;
                result.content = 'Rule이 갱신되었습니다.';
                result.value = JSON.parse(data.toString());
            } else {
                result.content = 'File Name을 확인해 주세요.';
            }

            res.send(result);
        });
    });
};