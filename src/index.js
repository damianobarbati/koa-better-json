import path from "node:path";
import stream from "node:stream";

const main =
  ({ spaces = 4, replacer = undefined } = {}) =>
  async (ctx, next) => {
    await next();

    const pathname = ctx.path;
    const extension = path.extname(pathname);
    const body = ctx.body;

    const bodyIsJsonEncodable =
      // path has no extension or extension is .json
      (!extension || extension === ".json") &&
      // body is not a buffer
      !Buffer.isBuffer(body) &&
      // body is not a readable stream
      !(body instanceof stream.Readable) &&
      // body is not an "old style" readable stream
      !(body && typeof body === "object" && typeof body.pipe === "function");

    // here the shit flows 💩
    if (ctx.body === null) {
      ctx.type = "application/json; charset=utf-8";
      ctx.status = 200;
      ctx.body = "null";
    } else {
      ctx.body = bodyIsJsonEncodable ? JSON.stringify(ctx.body, replacer, spaces) : body;
    }
  };

export default main;
