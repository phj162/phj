/*

 var data = [[1,0,1,0,1,1,1,0,0,0,0,0,1,0],
             [1,1,1,1,1,1,1,0,0,0,0,0,1,0],
             [1,1,1,0,1,1,1,0,1,0,0,0,1,0],
             [1,0,1,1,1,1,1,1,0,0,0,0,1,0],
             [1,1,1,1,1,1,1,0,0,0,0,0,1,1],
             [0,0,1,0,0,1,0,0,1,0,1,1,1,0],
             [0,0,0,0,0,0,1,1,1,0,1,1,1,0],
             [0,0,0,0,0,1,1,1,0,1,0,1,1,0],
             [0,0,1,0,1,0,1,1,1,1,0,1,1,1],
             [0,0,0,0,0,0,1,1,1,1,1,1,1,1],
             [1,0,1,0,0,1,1,1,1,1,0,0,1,0]];

 var result =  [23,12,23,23,45,70,123,73,146,158,64];

 var InputData = [0,0,0,0,0,0,0,1,1,1,1,1,1,1];

 msg = { sampleInput:data, sampleLabel:result, InputData:InputData };
 return msg;
 */
module.exports = function (RED) {
    var ml = require('machine_learning');

    function mlKnnNode(n) {

        RED.nodes.createNode(this, n);
        var node = this;


        this.on("input", function(msg) {


            node.log('Sample Input :'+ msg.sampleInput);
            node.log('Sample Label :'+ msg.sampleLabel);
            node.log('Input data :'+ msg.InputData);


            var data = msg.sampleInput;
            var result = msg.sampleLabel;


            var knn = new ml.KNN({
                data : data,
                result : result
            });

            var inputdata = msg.InputData;

            node.log('Kernel Type :'+ n.kernelType);

            var weightValue;
            if(n.kernelType == 'gaussian'){
                weightValue = {type : 'gaussian', sigma : Number(n.sigma)};

            }else if(n.kernelType == 'custom'){
                eval("weightValue = "+ n.func);
            }else{
                weightValue = {type: "none"};
            }

            var disValue;
            if(n.disType == 'custom'){
                eval("disValue = "+ n.funcD);
            }else{
                disValue = {type : 'euclidean'}
            }


            var y = knn.predict({
                x : inputdata,
                k : Number(n.kvalue),
                weightf : weightValue,
                distance : disValue
            });

            var sendMsg = {payload:y};
            node.send(sendMsg);
        });
    }
    RED.nodes.registerType("ml-knn", mlKnnNode);
}