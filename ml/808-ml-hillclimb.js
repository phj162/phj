module.exports = function (RED) {
    var ml = require('machine_learning');

    function mlHillNode(n) {

        RED.nodes.createNode(this, n);
        var node = this;
        var veclength = Number(n.vlength);
        var dmin = Number(n.dmin);
        var dmax = Number(n.dmax);

        this.on("input", function (msg) {
            var costf = function (vec) {
                var cost = 0;
                for (var i = 0; i < veclength - 1; i++) { // 15-dimensional vector
                    cost += (0.5 * i * vec[i] * Math.exp(-vec[i] + vec[i + 1]) / vec[i + 1])
                }
                cost += (3. * vec[veclength - 1] / vec[0]);
                return cost;
            };

            var tempfunc = n.func;
            if (tempfunc !== undefined && tempfunc != '') {

                eval("costf = " + n.func);
            }

            var domain = [];
            for (var i = 0; i < veclength; i++)
                domain.push([dmin, dmax]); // domain[idx][0] : minimum of vec[idx], domain[idx][1] : maximum of vec[idx].

            var vec = ml.optimize.hillclimb({
                domain: domain,
                costf: costf
            });

            var result = {"vec": vec, "cost": costf(vec)};
            var sendMsg = {payload: result};
            node.send(sendMsg);

        });
    }
    RED.nodes.registerType("ml-hillclimb", mlHillNode);
}