# koa-better-json

Koa middleware returning JSON encoded response.

The middleware will encode only:
- pathname having an empty or `.json` extension
- encodable body

Why not simply use the most common `koa-json`?
`koa-json` has the following behaviours / limitations:
- you can't return a `null` payload (eg: `ctx.body = null`) as this results in a 204 empty response
- you can't return a plain string payload (eg: `ctx.body = 'hello there') as this results in plain text response

If you need to send valid `null` and plain values response then this middleware is for you.

## Usage

Install:
```sh
yarn add koa-better-json
```

Usage:
```js
import http from 'http';
import koa from 'koa';
import json from 'koa-better-json';

const app = new koa()
app.use(json());
app.use(ctx => ctx.body = { foo: 'bar' });
app.use(ctx => ctx.body = null);
app.use(ctx => ctx.body = 'abc');

const server = http
  .createServer(app.callback())
  .listen(8080, console.log);
```

## Options
- `pretty` default to pretty response (default to `true`)
- `spaces` JSON spaces (default to `2`)
- `replacer` JSON replacer (default to `undefined`)