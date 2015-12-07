
exports.getSize = function(msg){
    var msgSize = 0;
    if(msg != null){
        msgSize = (function(s,b,i,c){
            for(b=i=0;c=s.charCodeAt(i++);b+=c>>11?3:c>>7?2:1);
            return b
        })(msg);
    }
    return msgSize;
}



exports.getLengthHeader = function (msg){
    var msgSize = this.getSize(msg);
    var lengthHeader = this.lpad(String(msgSize), 4, '0');
    return lengthHeader;

}


exports.getSize = function (msg){
    var msgSize = 0;
    if(msg != null){
        msgSize = (function(s,b,i,c){
            for(b=i=0;c=s.charCodeAt(i++);b+=c>>11?3:c>>7?2:1);
            return b
        })(msg);
    }
    return msgSize;
}


exports.lpad = function (originalstr, length, strToPad) {
    while (originalstr.length < length)
        originalstr = strToPad + originalstr;
    return originalstr;
}




