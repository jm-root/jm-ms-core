import chai from 'chai';
let expect = chai.expect;
import utils from '../src/utils';

describe('utils', function () {
    it('preRequest', function () {
        let v = ['uri', 'type', 'data', 'params', 'timeout'];
        let uri = '/test';
        let type = 'get';
        let data = {
            name: 'jeff',
            age: 18
        };
        let params = {
            token: 'asdfasdjfk'
        };
        let timeout = 1000;
        let opts = {
            uri: uri,
            type: type,
            data: data,
            params: params,
            timeout: timeout,
        };
        let cb = function (err, doc) {
        };
        let check = (obj1, obj2) => {
            if ((obj1.cb || obj2.cb) && (obj1.cb !== obj2.cb)) return false;
            for (let key of v) {
                if (obj1.opts[key] !== obj2.opts[key]) {
                    console.log('obj1.opts: %s obj2.opts: %s', utils.formatJSON(obj1.opts), utils.formatJSON(obj2.opts))
                    return false;
                }
            }
            return true;
        };
        let pre = utils.preRequest;

        // request({uri:uri, type:type, data:data, params:params, timeout:timeout}, cb)
        expect(check(pre(opts, cb), {opts: opts, cb: cb})).to.be.ok;

        // request({uri:uri, type:type, data:data, params:params, timeout:timeout})
        expect(check(pre(opts), {opts: opts})).to.be.ok;

        // request(uri, type, data, params, timeout, cb)
        expect(check(pre(uri, type, data, params, timeout, cb), {opts: opts, cb: cb})).to.be.ok;

        // request(uri, type, data, params, cb)
        expect(check(pre(uri, type, data, params, cb), {opts: {
            uri: uri,
            type: type,
            data: data,
            params: params,
        }, cb: cb})).to.be.ok;

        // request(uri, type, data, cb)
        expect(check(pre(uri, type, data, cb), {opts: {
            uri: uri,
            type: type,
            data: data,
        }, cb: cb})).to.be.ok;

        // request(uri, type, cb)
        expect(check(pre(uri, type, cb), {opts: {
            uri: uri,
            type: type,
        }, cb: cb})).to.be.ok;

        // request(uri, cb)
        expect(check(pre(uri, cb), {opts: {
            uri: uri,
        }, cb: cb})).to.be.ok;

        // request(uri, type, data, params, timeout)
        expect(check(pre(uri, type, data, params, timeout), {opts: opts})).to.be.ok;

        // request(uri, type, data, params)
        expect(check(pre(uri, type, data, params), {opts: {
            uri: uri,
            type: type,
            data: data,
            params: params,
        }})).to.be.ok;

        // request(uri, type, data)
        expect(check(pre(uri, type, data), {opts: {
            uri: uri,
            type: type,
            data: data,
        }})).to.be.ok;

        // request(uri, type)
        expect(check(pre(uri, type), {opts: {
            uri: uri,
            type: type,
        }})).to.be.ok;

        // request(uri)
        expect(check(pre(uri), {opts: {
            uri: uri,
        }})).to.be.ok;

        // request(uri, type, data, timeout, cb)
        expect(check(pre(uri, type, data, timeout, cb), {opts: {
            uri: uri,
            type: type,
            data: data,
            timeout: timeout,
        }, cb: cb})).to.be.ok;

        // request(uri, type, timeout, cb)
        expect(check(pre(uri, type, timeout, cb), {opts: {
            uri: uri,
            type: type,
            timeout: timeout,
        }, cb: cb})).to.be.ok;

        // request(uri, timeout, cb)
        expect(check(pre(uri, timeout, cb), {opts: {
            uri: uri,
            timeout: timeout,
        }, cb: cb})).to.be.ok;

        // request(uri, type, data, timeout)
        expect(check(pre(uri, type, data, timeout), {opts: {
            uri: uri,
            type: type,
            data: data,
            timeout: timeout,
        }})).to.be.ok;

        // request(uri, type, timeout)
        expect(check(pre(uri, type, timeout), {opts: {
            uri: uri,
            type: type,
            timeout: timeout,
        }})).to.be.ok;

        // request(uri, timeout)
        expect(check(pre(uri, timeout), {opts: {
            uri: uri,
            timeout: timeout,
        }})).to.be.ok;

    });

});
