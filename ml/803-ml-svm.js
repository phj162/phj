/*

 var x = [[0.4, 0.5, 0.5, 0.,  0.,  0.],
 [0.5, 0.3,  0.5, 0.,  0.,  0.01],
 [0.4, 0.8, 0.5, 0.,  0.1,  0.2],
 [1.4, 0.5, 0.5, 0.,  0.,  0.],
 [1.5, 0.3,  0.5, 0.,  0.,  0.],
 [0., 0.9, 1.5, 0.,  0.,  0.],
 [0., 0.7, 1.5, 0.,  0.,  0.],
 [0.5, 0.1,  0.9, 0.,  -1.8,  0.],
 [0.8, 0.8, 0.5, 0.,  0.,  0.],
 [0.,  0.9,  0.5, 0.3, 0.5, 0.2],
 [0.,  0.,  0.5, 0.4, 0.5, 0.],
 [0.,  0.,  0.5, 0.5, 0.5, 0.],
 [0.3, 0.6, 0.7, 1.7,  1.3, -0.7],
 [0.,  0.,  0.5, 0.3, 0.5, 0.2],
 [0.,  0.,  0.5, 0.4, 0.5, 0.1],
 [0.,  0.,  0.5, 0.5, 0.5, 0.01],
 [0.2, 0.01, 0.5, 0.,  0.,  0.9],
 [0.,  0.,  0.5, 0.3, 0.5, -2.3],
 [0.,  0.,  0.5, 0.4, 0.5, 4],
 [0.,  0.,  0.5, 0.5, 0.5, -2]
 ];

 var y =  [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,1,1,1,1,1,1,1,1,1];

 var InputData = [1.3,  1.7,  0.5, 0.5, 1.5, 0.4];

 msg = { sampleInput:x, sampleLabel:y, InputData:InputData };
 return msg;
 */
module.exports = function (RED) {
    var ml = require('machine_learning');

    function mlSvmNode(n) {

        RED.nodes.createNode(this, n);
        var node = this;


        this.on("input", function(msg) {


            node.log('Sample Input :'+ msg.sampleInput);
            node.log('Sample Label :'+ msg.sampleLabel);
            node.log('Input data :'+ msg.InputData);


            var x = msg.sampleInput;
            var y = msg.sampleLabel;


            var svm = new ml.SVM({
                x : x,
                y : y
            });

            node.log("CC :" + Number(n.cvalue));
            node.log("tol :" + Number(n.tol));
            node.log("max_passes :" + Number(n.maxpasses));
            node.log("alpha_tol :" + Number(n.alphatol));
            node.log('Kernel Type :'+ n.kernelType);

            var C = Number(n.cvalue);
            var tol = Number(n.tol);
            var max_passes = Number(n.maxpasses);
            var alpha_tol = Number(n.alphatol);
            var kernelType = n.kernelType;

            var kernel='';
            if(kernelType === 'polynomial'){
                kernel = { type: "polynomial", c: Number(n.cc), d: Number(n.dd)};
            }else if(kernelType === 'linear'){
                kernel = {type : "linear"};
            }else if(kernelType === 'custom'){
                node.log("Func : "+ n.func);
                eval("kernel = "+ n.func);
            }else if(kernelType === 'gaussian'){
                kernel = {type : "gaussian", sigma : Number(n.sigma)};
            }

            svm.train({
                C : C,
                tol : tol,
                max_passes : max_passes,
                alpha_tol : alpha_tol,
                kernel : kernel
            });

            var inputdata = msg.InputData;

            var sendMsg = {payload:svm.predict(inputdata)};
            node.send(sendMsg);
        });
    }
    RED.nodes.registerType("ml-svm", mlSvmNode);
}