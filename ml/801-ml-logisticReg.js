/*

Front Function Define

 var x = [[1,1,1,0,0,0],
         [1,0,1,0,0,0],
         [1,1,1,0,0,0],
         [0,0,1,1,1,0],
         [0,0,1,1,0,0],
         [0,0,1,1,1,0]];

 var y = [[1, 0],
         [1, 0],
         [1, 0],
         [0, 1],
         [0, 1],
         [0, 1]];

 var InputData = [[1, 1, 0, 0, 0, 0],
                 [0, 0, 0, 1, 1, 0],
                 [1, 1, 1, 1, 1, 0]];

 msg = { sampleInput:x, sampleLabel:y,InputData:InputData };
 return msg;

 */

module.exports = function (RED) {
    var ml = require('machine_learning');

    function mlLogisticRegNode(n) {

        RED.nodes.createNode(this, n);
        var node = this;



        this.on("input", function(msg) {

            node.log('Sample Input :'+ msg.sampleInput);
            node.log('Sample Label :'+ msg.sampleLabel);

            var x = msg.sampleInput;
            var y = msg.sampleLabel;

            var classifier = new ml.LogisticRegression({
                'input' : x,
                'label' : y,
                'n_in' : x[0].length,
                'n_out' : y[0].length
            });

            classifier.set('log level',0);

            node.log('Train epochs :' + n.epochs);
            node.log('Train lr :' + n.lr);

            classifier.train({
                'lr' : n.lr,
                'epochs' : n.epochs
            });

            var inputdata = msg.InputData;

            console.log("Entropy : "+classifier.getReconstructionCrossEntropy());
            // console.log("W : " + classifier.W);
            // console.log("b : " + classifier.b);
            console.log("Result : ",classifier.predict(inputdata));

            var sendMsg = {payload:classifier.predict(inputdata)};
            node.send(sendMsg);
        });

    }
    RED.nodes.registerType("ml-logisticReg", mlLogisticRegNode);
}


