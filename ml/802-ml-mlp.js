/*

 Front Function Define

 var x = [[0.4, 0.5, 0.5, 0,  0,  0],
          [0.5, 0.3,  0.5, 0,  0,  0],
          [0.4, 0.5, 0.5, 0,  0,  0],
          [0,  0,  0.5, 0.3, 0.5, 0],
          [0,  0,  0.5, 0.4, 0.5, 0],
          [0,  0,  0.5, 0.5, 0.5, 0]];

 var y = [[1, 0],
         [1, 0],
         [1, 0],
         [0, 1],
         [0, 1],
         [0, 1]];

 var InputData = [[0.5, 0.5, 0, 0, 0, 0],
                  [0, 0, 0, 0.5, 0.5, 0],
                  [0.5, 0.5, 0.5, 0.5, 0.5, 0]];

 msg = { sampleInput:x, sampleLabel:y, InputData:InputData };
 return msg;

 */
module.exports = function (RED) {
    var ml = require('machine_learning');

    function mlMlpNode(n) {

        RED.nodes.createNode(this, n);
        var node = this;


        this.on("input", function(msg) {


            node.log('Sample Input :'+ msg.sampleInput);
            node.log('Sample Label :'+ msg.sampleLabel);


            var x = msg.sampleInput;
            var y = msg.sampleLabel;
            var z = JSON.parse(n.hiddenlayers);


            node.log('Hidden Layer :'+ z);

            var mlp = new ml.MLP({
                'input' : x,
                'label' : y,
                'n_ins' : x[0].length,
                'n_outs' : y[0].length,
                'hidden_layer_sizes' : z
            });

            mlp.set('log level',0); // 0 : nothing, 1 : info, 2 : warning.

            mlp.train({
                'lr' : n.lr,
                'epochs' : n.epochs
            });

            var inputdata = msg.InputData;

            var sendMsg = {payload:mlp.predict(inputdata)};
            node.send(sendMsg);
        });
    }
    RED.nodes.registerType("ml-mlp", mlMlpNode);
}

