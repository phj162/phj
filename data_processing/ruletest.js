/**
 * Created by Jung on 2015-11-30.
 */
function ruleCheck(aJson, bJson) {
    var flag = true;

    for (var key in aJson) {
        if (!bJson.hasOwnProperty(key)) {
            flag = false;
        } else {
            if (typeof aJson[key] === typeof bJson[key]) {
                if (typeof aJson[key] === 'object') {
                    if (Array.isArray(aJson[key])) {
                        for (var index in aJson[key]) {
                            if (!ruleCheck(aJson[key][index], bJson[key][index])) {
                                flag = false;
                            }
                        }
                    } else {
                        if (!ruleCheck(aJson[key], bJson[key])) {
                            flag = false;
                        }
                    }
                }
            } else {
                flag = false;
            }
        }
    }

    console.log(aJson);
    console.log(bJson);
    console.log(flag);

    return flag;
}

ruleCheck(JSON.parse('{"key1": "1","group": {"name": "","title": ""}}'), JSON.parse('{"key2": "1","group": {"name": "","title": ""}}'));