# koa-better-json

Koa middleware returning JSON encoded response.

## Usage

Install:
```bash
yarn add koa-better-json
```

Usage:
```javascript
import koa from 'koa';
import json from 'koa-better-json';

const app = new koa()
app.use(json());

app.use(ctx => ctx.body = { foo: 'bar' });
```

Options passing (custom spacing and/or replacer):
```javascript
app.use(json({ spaces: 0 })); // pretty printing disabled
app.use(json({ spaces: 2 })); // pretty printing with 2 spaces
```

## Options
 - `spaces`: JSON spaces, default `4`
 - `replacer`: JSON replacer function
