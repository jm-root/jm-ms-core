import chai from 'chai';
let expect = chai.expect;
import MS from '../src';
import utils from '../src/utils';

let handle = (opts, cb, next) => {
    cb(null, {ret: 1});
};

let cb = (err, doc) => {
    if(err) console.log(err.stack);
    console.log('%j', doc);
};

let ms = new MS();
let app = ms.router();

let mdlTest = function (app, opts, cb) {
    app.clientModules.http = (opts, cb) => {
        let client = {
            request: function (opts, cb) {
                let r = utils.preRequest.apply(this, arguments);
                r.cb(null, {ret: 1});
            }
        };
        cb(null, client);
        return true;
    };

    return {
        name: 'test',
        unuse: () => {
            delete app.clientModules.http;
        },
    };
};

describe('ms', function () {
    it('router', function () {
        expect(app).to.be.an('object');
        app.add('/', handle);
        app.request('/', cb);
    });
    it('use', function () {
        ms.use(mdlTest);
        ms.client({uri:'http://ww.ja.cnom'}, function (err, doc) {
            expect(doc).to.be.an('object');
            doc.get('/', cb)
        })
    });

});
