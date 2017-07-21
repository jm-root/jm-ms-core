var MS = require('../lib');
var ms = new MS();

function cb(err, doc){
    if (err) {
        console.error(err.stack);
    }
    if(doc){
        console.log('%j', doc);
    }
};

var service = {
    hello: function(opts, cb) {
        cb(null, {ret: opts.data.msg});
    },
};

var router = ms.router();

router
    .add('/hello', 'get', service.hello)
    .use('/hello2', service.hello)
;

router.request('/hello', 'get', {msg: 'hello'}, cb);
router.get('/hello2', {msg: 'hello'}, cb);
