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

 msg = { sampleInput:data};
 return msg;

 */
module.exports = function (RED) {
    var ml = require('machine_learning');

    function mlKmeansNode(n) {

        RED.nodes.createNode(this, n);
        var node = this;


        this.on("input", function(msg) {


            node.log('Sample Input :'+ msg.sampleInput);

            var data = msg.sampleInput;



            node.log("K :" + Number(n.kvalue));
            node.log("epochs :" + Number(n.epochs));
            node.log('Distance Type :'+ n.disType);

            var K = Number(n.kvalue);
            var epochs = Number(n.epochs);
            var distanceType = n.disType;

            var distance='';
            if(distanceType === 'euclidean'){
                distance = {type : 'euclidean'};
            }else if(distanceType === 'pearson'){
                distance = {type : 'pearson'};
            }else if(distanceType === 'custom'){
                eval("distance = "+ n.func);
            }

            var result = ml.kmeans.cluster({
                data : data,
                k : K,
                epochs: epochs,
                distance : distance
            });

            var sendMsg = {payload:result.clusters};
            node.send(sendMsg);
        });
    }
    RED.nodes.registerType("ml-kmeans", mlKmeansNode);
}