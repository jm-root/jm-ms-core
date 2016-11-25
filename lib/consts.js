var jm = jm || {};
if (typeof module !== 'undefined' && module.exports) {
    jm = require('jm-core');
}

(function(){
    if(jm.ms.consts) return;
    var ms = jm.ms;

    var ERRCODE_MS = 900;
    jm.ERR.ms = {
        FA_INVALIDTYPE: {
            err: ERRCODE_MS++,
            msg: '无效的类型'
        }
    };

    ms.consts = {
    };

})();
