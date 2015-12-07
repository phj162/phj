/*

 var matrix = [[22,28],
                [49,64]];

 msg = { InputData:matrix };
 return msg;
 */
module.exports = function (RED) {
    var ml = require('machine_learning');

    function mlNmfNode(n) {

        RED.nodes.createNode(this, n);
        var node = this;

        this.on("input", function(msg) {

            var matrix = msg.InputData;
            node.log('Input data :'+ matrix);


            var result = ml.nmf.factorize({
                matrix : matrix,
                features : n.features,
                epochs : n.epochs
            });

            var sendMsg = {payload:result[0]};
            node.send(sendMsg);
        });
    }
    RED.nodes.registerType("ml-nmf", mlNmfNode);
}