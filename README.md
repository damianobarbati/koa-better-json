# koa-better-json

Koa middleware returning JSON encoded response.
The middleware will encode only:
- pathname having an empty or `.json` extension
- encodable body

**Why not simply use `koa-json`?**  
Because I can't return a `null` payload: `ctx.body = null` results in a 204 thus empty response.  
Once this PR will be merged <https://github.com/koajs/koa/pull/1421> I will finally detonate this repository and package.

## Requirements
- nodejs v14.15+

## Usage

Install:
```bash
yarn add koa-better-json
```

Usage:
```javascript
import http from 'http';
import koa from 'koa';
import json from 'koa-better-json';

const app = new koa()
app.use(json());
app.use(ctx => ctx.body = { foo: 'bar' });

const server = http
    .createServer(app.callback())
    .listen(8080, console.log);
```

Options passing (custom spacing and/or replacer):
```javascript
app.use(json({ spaces: 0 })); // pretty printing disabled
app.use(json({ spaces: 2 })); // pretty printing with 2 spaces
```

## Options
 - `spaces`: JSON spaces, default `4`
 - `replacer`: JSON replacer function