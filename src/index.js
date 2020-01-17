import { Readable } from 'stream';

const main = ({ spaces = 4, replacer = undefined } = {}) => async (ctx, next) => {
    await next();

    const body = ctx.body;

    const bodyIsJsonEncodable =
        // body is not a buffer
        !Buffer.isBuffer(body) &&
        // body is not a readable stream
        !(body instanceof Readable) &&
        // body is not an "old style" readable stream
        !(body && typeof body === 'object' && typeof body.pipe === 'function');

    ctx.body = bodyIsJsonEncodable ? JSON.stringify(ctx.body, replacer, spaces) : body;
};

export default main;
