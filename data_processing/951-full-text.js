/**
 * Created by Jung on 2015-11-10.
 */
module.exports = function (RED) {
    function SampleNode(n) {
        RED.nodes.createNode(this, n);
        this.rules = n.rules || [];

        var node = this;

        this.on('input', function (msg) {
            if (node.rules != undefined && node.rules != '') {
                var jsonResult = {};
                for (var i in node.rules) {
                    if (node.rules[i].key != undefined) {
                        jsonResult[node.rules[i].key] = msg.payload.substring(node.rules[i].lenStart, node.rules[i].lenEnd);
                    }
                }

                msg.payload = jsonResult;
            }

            node.send(msg);
        });
    }

    RED.nodes.registerType('full-text', SampleNode);
}
