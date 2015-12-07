/*

 var data = [['slashdot','USA','yes',18],
             ['google','France','yes',23],
             ['digg','USA','yes',24],
             ['kiwitobes','France','yes',23],
             ['google','UK','no',21],
             ['(direct)','New Zealand','no',12],
             ['(direct)','UK','no',21],
             ['google','USA','no',24],
             ['slashdot','France','yes',19],
             ['digg','USA','no',18,],
             ['google','UK','no',18,],
             ['kiwitobes','UK','no',19],
             ['digg','New Zealand','yes',12],
             ['slashdot','UK','no',21],
             ['google','UK','yes',18],
             ['kiwitobes','France','yes',19]];

 var result =  ['None','Premium','Basic','Basic','Premium','None','Basic','Premium','None','None','None','None','Basic','None','Basic','Basic'];

 var InputData = ['(direct)','USA','yes',5];

 msg = { sampleInput:data, sampleLabel:result, InputData:InputData };
 return msg;
 */
module.exports = function (RED) {
    var ml = require('machine_learning');

    function mlDtNode(n) {

        RED.nodes.createNode(this, n);
        var node = this;


        this.on("input", function(msg) {


            node.log('Sample Input :'+ msg.sampleInput);
            node.log('Sample Label :'+ msg.sampleLabel);
            node.log('Input data :'+ msg.InputData);


            var data = msg.sampleInput;
            var result = msg.sampleLabel;


            var dt = new ml.DecisionTree({
                data : data,
                result : result
            });

            dt.build();

            var inputdata = msg.InputData;

            var sendMsg = {payload: dt.classify(inputdata)};
            node.send(sendMsg);
        });
    }
    RED.nodes.registerType("ml-dt", mlDtNode);
}