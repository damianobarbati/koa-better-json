import { Readable } from 'stream';
import request from 'supertest';
import koa from 'koa';
import json from './index.js';

describe('primitives/objects', () => {
    it('string', async () => {
        const app = new koa();
        app.use(json());
        app.use(ctx => ctx.body = 'foobar');

        const response = await request(app.listen()).get('/');

        expect(response.text).toEqual('"foobar"');
    });

    it('object', async () => {
        const app = new koa();
        app.use(json());
        app.use(ctx => ctx.body = { foo: 'bar' });

        const response = await request(app.listen()).get('/');

        expect(response.text).toEqual('{\n    "foo": "bar"\n}');
    });

    it('object with null/undefined values', async () => {
        const app = new koa();
        app.use(json());
        app.use(ctx => ctx.body = { foo: null, bar: undefined });

        const response = await request(app.listen()).get('/');

        expect(response.text).toEqual('{\n    "foo": null\n}');
    });

    it('spaces are honored', async () => {
        const app = new koa();
        app.use(json({ spaces: 0 }));
        app.use(ctx => ctx.body = { foo: 'bar', a: 1 });

        const response = await request(app.listen()).get('/');

        expect(response.text).toEqual('{"foo":"bar","a":1}');
    });

    it('do not encode if pathname has extension or extension is not .json', async () => {
        const app = new koa();
        app.use(json({ spaces: 0 }));
        app.use(ctx => {
            if (ctx.path === 'test')
                ctx.body  = 'ok';
            else if (ctx.path === 'test.txt')
                ctx.body  = 'ok';
            else if (ctx.path === 'test.json')
                ctx.body  = 'ok';
            else
                ctx.body  = 'ok';
        });

        const response2 = await request(app.listen()).get('/test.txt');
        const response3 = await request(app.listen()).get('/test.json');
        const response4 = await request(app.listen()).get('/test');

        expect(response2.text).toEqual('ok');
        expect(response3.text).toEqual('"ok"');
        expect(response4.text).toEqual('"ok"');
    });

    // waiting for https://github.com/koajs/koa/pull/1421
    xit('null is not suppressed', async () => {
        const app = new koa({ response: { emptyBodyAs204: false } });

        app.use(json());
        app.use(ctx => ctx.body = null);

        const response = await request(app.listen()).get('/');

        expect(response.text).toEqual('null');
    });
});

describe('streams', () => {
    it('are not encoded', async () => {
        const app = new koa();

        app.use(json());

        app.use(ctx => {
            const stream = new Readable();
            stream.push('<html></html>');
            stream.push(null);
            ctx.body = stream;
        });

        const response = await request(app.listen()).get('/');

        expect(response.status).toEqual(200);
        expect(response.headers).toEqual(jasmine.objectContaining({ 'content-type': 'application/octet-stream' }));
        expect(response.body.toString()).toEqual('<html></html>');
    });
});
