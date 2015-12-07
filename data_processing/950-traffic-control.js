/**
 * Created by Jung on 2015-11-10.
 */
module.exports = function (RED) {
    function TrafficControlNode(n) {
        RED.nodes.createNode(this, n);
        this.trafficType = n.trafficType || '';
        this.trafficTypeValue = n.trafficTypeValue || 0;

        var node = this;
        var msgArr = [];
        var msgIngCnt = 0;
        var msgTime = new Date();
        var run = false;

        if (node.trafficType != '') {
            if (!isNaN(node.trafficTypeValue) && Number(node.trafficTypeValue) != 0) {
                var run = true;
                node.status({fill: 'green', shape: 'dot', text: 'Success'});
            } else {
                node.status({fill: 'red', shape: 'dot', text: 'Not Number Value'});
            }
        } else {
            node.status({fill: 'red', shape: 'dot', text: 'Not Seleted Type'});
        }

        this.on('input', function (msg) {
            if (run) {
                if (node.trafficType == 'mlc') {
                    msgArr.push(msg.payload);
                    if (msgIngCnt < node.trafficTypeValue - 1) {
                        msgIngCnt++;
                    } else {
                        msg.payload = msgArr;
                        node.send(msg);
                        msgArr = [];
                        msgIngCnt = 0;
                    }
                } else if (node.trafficType == 'mit') {
                    var tmpTime = new Date();
                    if (Math.floor((tmpTime.getTime() - msgTime.getTime()) / 1000) >= Number(node.trafficTypeValue)) {
                        node.send(msg);
                        msgTime = tmpTime;
                    }
                }
            } else {
                node.send(msg);
            }
        });
    }

    RED.nodes.registerType('traffic-control', TrafficControlNode);
}