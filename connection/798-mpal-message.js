var util = require('./799-custom-util.js');

var xml2js = require('xml2js');
var parseString = xml2js.parseString;
var builder = new xml2js.Builder({renderOpts:{pretty:false}});



exports.parseMsg = function(msg){
    var returnMsg = null;

    try{

        var source = msg.substr(0, 4);
        var destination = msg.substr(4, 4);
        var type = msg.substr(8, 3);
        var length = msg.substr(11, 4);
        var contents = msg.substr(15);

        returnMsg = {
            header : {source: source, destination: destination, type:type},
            payload : contents};

    } catch(err) {
        console.log("[ZMQ-PARSER-ERROR]" + err);
    }

    return returnMsg;
}

exports.generateReqStr = function (appId, dest, msgType, contents){
    var returnMsg = "";

    returnMsg = appId + dest + msgType;

    returnMsg += util.getLengthHeader(contents);
    returnMsg += contents;

    return returnMsg;
}



exports.getWIQString = function (appId){
    var returnMsg = this.generateReqStr(appId, 'MPLM', 'WIQ', '');
    return returnMsg;
}

exports.getWBQString = function (appId, moduleIdx){
    var returnMsg = this.generateReqStr(appId, 'MPLM', 'WBQ', 'WSN'+String(moduleIdx));
    return returnMsg;
}

exports.getCSQString = function (appId, moduleList){
    var returnMsg = this.generateReqStr(appId, 'MPLM', 'CSQ', '');
    return returnMsg;
}

exports.getPSQString = function (appId, moduleList){
    var returnMsg = "";

    var modules = {
        module: {
            $:{
                name: "MSM320",
                phy_tech: "LoRa",
                mac_tech: "802.15.4"
            },
            settings : {$:{
                freq: "917100",
                spreading_factor: "6",
                tx_power: "-1"
            }}
        }
    };


    var builder = new xml2js.Builder({rootName:'profile'});
    var profiles = builder.buildObject(modules);

    //returnMsg += util.getLengthHeader(profiles);
    //returnMsg += profiles;

    returnMsg = this.generateReqStr(appId, 'MPLM', 'PSQ', profiles);

    return returnMsg;
}

exports.getWRMString = function (appId, moduleIdx, content){
    var returnMsg = this.generateReqStr(appId, 'WSN'+ String(moduleIdx), 'WRM', content);
    return returnMsg;
}


exports.parseWIRContent = function(msg, returnFunction){


    parseString(msg, function (err, result) {

        var modulesElement = result.configure.wsn[0];
        var moduleCnt = result.configure.wsn[0].$.install_cnt;

        var moduleList = [];

        // install_cnt 만큼 반복하며, element 이름은 module_[1~install_cnt] 값임.
        for( var i=1 ; i <= moduleCnt ; i++ ){

            var moduleElement = eval("modulesElement.module_"+i)[0];

            var connParamArray = moduleElement.$.conn_param.split(",");



            var moduleObj = {
                idx : i,
                wsnName : "WSN"+String(i),
                name : moduleElement.$.name,
                phyTech : moduleElement.$.phy_tech,
                macTech : moduleElement.$.mac_tech,
                connDevice : moduleElement.$.conn_device,
                connParam : moduleElement.$.conn_param,
                baudRate: connParamArray[0],
                dataBits:connParamArray[1],
                parity:connParamArray[2],
                trafficType : moduleElement.$.traffic_type,
                used : moduleElement.$.used
            };

            moduleList.push(moduleObj);
        }



        returnFunction(moduleList);





    });
}