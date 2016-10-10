var jm = jm || {};
if (typeof module !== 'undefined' && module.exports) {
    jm = require('../lib');
    Promise = require('bluebird');
}

(function(){
    var ms = jm.ms;
    var logger = jm.logger;
    var utils = ms.utils;
    var pathToRegexp = ms.pathToRegexp;
    var app = ms();

    var log = function(err, doc){
        if (err) {
            logger.error(err.stack);
        }
        if(doc){
            logger.debug('%s', utils.formatJSON(doc));
        }
    };

    var done = function(resolve, reject, err, doc){
        log(err, doc);
        if (err) {
            reject(err, doc);
        } else {
            resolve(doc);
        }
    };

    var add = function(opts){
        return new Promise(function(resolve, reject){
            logger.debug('add %s', utils.formatJSON(opts));
            app.add(opts, function(err, doc){
                log(err, doc);
                resolve(doc);
            });
        });
    };

    var use = function(opts){
        return new Promise(function(resolve, reject){
            logger.debug('use %s', utils.formatJSON(opts));
            var o = {
                _request: function(opts, cb){
                    logger.debug('o %s', utils.formatJSON(opts));
                    cb(null, {o:123});
                },

                handler: function(opts, cb, next){
                    logger.debug('o %s', utils.formatJSON(opts));
                    next();
                }
            };
            app.use({uri: '/users/:id', fn:o});

            var router = ms.router();
            router.use(opts);
            app.use({uri: '/users', fn: router});
            resolve({});
        });
    };

    var request = function(opts){
        return new Promise(function(resolve, reject){
            logger.debug('request %s', utils.formatJSON(opts));
            app.request(opts, function(err, doc){
                log(err, doc);
                resolve(doc);
            });
        });
    };

    var notify = function(opts){
        return new Promise(function(resolve, reject){
            logger.debug('notify %s', utils.formatJSON(opts));
            app.request(opts);
            resolve({});
        });
    };

    var path2regexp = function(opts){
        return new Promise(function(resolve, reject){
            logger.debug('path2regexp');
            var keys = [];
            var re = pathToRegexp('/:foo/:bar', keys);
            log(null, keys);
// keys = [{ name: 'foo', ... }, { name: 'bar', ... }]

            keys = re.exec('/test/route');
            log(null, keys);
//=> ['/test/route', 'test', 'route']
            resolve(null);
        });
    };

    var fn = function(opts, cb, next){
        logger.debug('fn called. %s', utils.formatJSON(opts));
        opts.step = opts.step || 0;
        opts.step++;
        next();
    };

    var opts = {
        uri: '/users/*',
        fn: [fn, fn],
        request: {
            uri: '/users/123',
            data: {
                test: true
            }
        }
    };

    var opts1 = {
        uri: '/:id',
        fn: function(opts, cb){
            logger.debug('fn called 2. %s', utils.formatJSON(opts));
            cb(null, opts.data);
        }
    };
    add(opts)
        //.then(function(doc){
        //    return add(opts);
        //})
        .then(function(doc){
            return use(opts1);
        })
        .then(function(doc){
            return request(opts.request);
        })
        .then(function(doc){
            return notify(opts.request);
        })
        //.then(function(doc){
        //    return path2regexp();
        //})
        .catch(SyntaxError, function(e) {
            logger.error(e.stack);
        })
        .catch(function(e) {
            logger.error(e.stack);
        });

})();