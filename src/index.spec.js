import { Readable } from "node:stream";
import koa from "koa";
import compress from "koa-compress";
import request from "supertest";
import { describe, expect, it } from "vitest";
import json from "./index.js";

describe("primitives/objects", () => {
  it("string", async () => {
    const app = new koa();
    app.use(json());
    app.use((ctx) => (ctx.body = "foobar"));

    const server = app.listen();
    const response = await request(server).get("/");
    expect(response.text).toEqual('"foobar"');
    server.close();
  });

  it("string + compress", async () => {
    const app = new koa();
    app.use(json());
    app.use(compress());
    app.use((ctx) => (ctx.body = "foobar"));

    const server = app.listen();
    const response = await request(server).get("/");
    expect(response.text).toEqual('"foobar"');
    server.close();
  });

  it("object", async () => {
    const app = new koa();
    app.use(json());
    app.use((ctx) => (ctx.body = { foo: "bar" }));

    const server = app.listen();
    const response = await request(server).get("/");
    expect(response.text).toEqual('{\n    "foo": "bar"\n}');
    server.close();
  });

  it("object with null/undefined values", async () => {
    const app = new koa();
    app.use(json());
    app.use((ctx) => (ctx.body = { foo: null, bar: undefined }));

    const server = app.listen();
    const response = await request(server).get("/");
    expect(response.text).toEqual('{\n    "foo": null\n}');
    server.close();
  });

  it("spaces are honored", async () => {
    const app = new koa();
    app.use(json({ spaces: 0 }));
    app.use((ctx) => (ctx.body = { foo: "bar", a: 1 }));

    const server = app.listen();
    const response = await request(server).get("/");
    expect(response.text).toEqual('{"foo":"bar","a":1}');
    server.close();
  });

  it("do not encode if pathname has extension or extension is not .json", async () => {
    const app = new koa();
    app.use(json({ spaces: 0 }));
    app.use((ctx) => {
      if (ctx.path === "test") ctx.body = "ok";
      else if (ctx.path === "test.txt") ctx.body = "ok";
      else if (ctx.path === "test.json") ctx.body = "ok";
      else ctx.body = "ok";
    });

    const server = app.listen();
    const response2 = await request(server).get("/test.txt");
    const response3 = await request(server).get("/test.json");
    const response4 = await request(server).get("/test");

    expect(response2.text).toEqual("ok");
    expect(response3.text).toEqual('"ok"');
    expect(response4.text).toEqual('"ok"');
    server.close();
  });

  // waiting for https://github.com/koajs/koa/pull/1421
  // const app = new koa({ response: { emptyBodyAs204: false } });
  it("null is not suppressed", async () => {
    const app = new koa();

    app.use(json());
    app.use((ctx) => (ctx.body = null));

    const server = app.listen();
    const response = await request(server).get("/");
    expect(response.text).toEqual("null");
    server.close();
  });
});

describe("streams", () => {
  it("are not encoded", async () => {
    const app = new koa();

    app.use(json());

    app.use((ctx) => {
      const stream = new Readable();
      stream.push("<html></html>");
      stream.push(null);
      ctx.body = stream;
    });

    const server = app.listen();
    const response = await request(server).get("/");
    expect(response.status).toEqual(200);
    expect(response.headers).toEqual(expect.objectContaining({ "content-type": "application/octet-stream" }));
    expect(response.body.toString()).toEqual("<html></html>");
    server.close();
  });
});
