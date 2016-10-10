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

    //var app1 = ms();app1.use(fn, fn2);app.use(app1);
    app.use({fn: fn}); app.use({uri:'/', fn: fn2});
    //app.use(fn, fn2);
    //app.use([fn, fn2]);
    //app.use('/users/:id', fn, fn2);
    //app.use('/users/:id', [fn, fn2]);

    app.request({
        uri: '/users/123',
        data: {
            test: true
        }
    }, function(err, doc){
        log(err, doc);
    });


})();