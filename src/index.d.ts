import type * as Koa from "koa";

export default function main(opts?: {
  spaces?: number;
  replacer?: any;
}): Koa.Middleware;
