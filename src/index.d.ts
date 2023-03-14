// Type definitions for koa-better-json
import * as Koa from "koa";

declare function json(opts?: {
  pretty?: boolean | undefined,
  spaces?: number | undefined,
  replacer?: any
}): Koa.Middleware;

declare namespace json { }

export = json;
