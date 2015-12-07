/**
 * Created by Jung on 2015-11-13.
 */
module.exports = function (RED) {
    function SampleNode(n) {
        RED.nodes.createNode(this, n);

        var node = this;
        this.on('input', function (msg) {
            var tNum = Math.floor(Math.random() * 100) + 1;

            msg.payload = tNum;
            node.send(msg);
        });
    }

    RED.nodes.registerType('data-set', SampleNode);

    RED.httpAdmin.post('/dataSet/:id', function (req, res) {
        var node = RED.nodes.getNode(req.params.id);
        if (node != null) {
            try {
                node.receive();
                res.sendStatus(200);
            } catch (err) {
                res.sendStatus(500);
            }
        } else {
            res.sendStatus(404);
        }
    });
}