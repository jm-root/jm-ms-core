var jm = jm || {};
if (typeof module !== 'undefined' && module.exports) {
    jm = require('../lib');
    Promise = require('bluebird');
}

(function(){
    var ms = jm.ms;
    var logger = jm.logger;
    var utils = ms.utils;
    var app = ms();

    var log = function(err, doc){
        if (err) {
            logger.error(err.stack);
        }
        if(doc){
            logger.debug('%s', utils.formatJSON(doc));
        }
    };

    var fn = function(opts, cb, next){
        logger.debug('fn called. %s', utils.formatJSON(opts));
        next();
    };

    var fn2 = function(opts, cb, next){
        logger.debug('fn2 called. %s', utils.formatJSON(opts));
        cb(null, {ret:true});
    };

    app.use({
        handle: function(opts, cb, next) {
            logger.debug('object called. %s', utils.formatJSON(opts));
            next();
        }
    });
    app.use(fn);
    app.add('/users/:id', fn2);

    app.request({
        uri: '/users/123',
        data: {
            test: true
        }
    }, function(err, doc){
        log(err, doc);
    });

    app.clear();
    logger.debug('clear all routes');
    app.request({
        uri: '/users/123',
        data: {
            test: true
        }
    }, function(err, doc){
        log(err, doc);
    });

})();