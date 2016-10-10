var jm = jm || {};
if (typeof module !== 'undefined' && module.exports) {
    jm = require('jm-core');
}

/**
 * ms对象
 * @class  ms
 */
(function(){
    jm.ms = function(opts){
        var router = jm.ms.router(opts);
        return router;
    };
})();

