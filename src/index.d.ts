import type * as Koa from "koa";

declare function json(opts?: {
  pretty?: boolean | undefined;
  spaces?: number | undefined;
  replacer?: any;
}): Koa.Middleware;

declare namespace json {}

export = json;
