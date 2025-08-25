"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// start/env.ts
var env_exports = {};
__export(env_exports, {
  Env: () => Env
});
module.exports = __toCommonJS(env_exports);
var import_config = require("dotenv/config");
var import_zod = require("zod");
var schema = import_zod.z.object({
  NODE_ENV: import_zod.z.enum(["development", "test", "production"]).default("development"),
  PORT: import_zod.z.coerce.number().default(3e3),
  JWT_PUBLIC_KEY: import_zod.z.string().trim(),
  JWT_PRIVATE_KEY: import_zod.z.string().trim(),
  COOKIE_SECRET: import_zod.z.string().trim(),
  ADMIN_PASSWORD: import_zod.z.string().trim(),
  ADMIN_EMAIL: import_zod.z.string().trim(),
  DATABASE_URL: import_zod.z.string().trim(),
  DB_HOST: import_zod.z.string().trim().default("localhost"),
  DB_PORT: import_zod.z.coerce.number().default(5432),
  DB_USER: import_zod.z.string().trim(),
  DB_PASSWORD: import_zod.z.string().trim(),
  DB_DATABASE: import_zod.z.string().trim()
});
var validation = schema.safeParse(process.env);
if (!validation.success) {
  console.error("Invalid environment variables", validation.error.format());
  throw new Error("Invalid environment variables");
}
var Env = validation.data;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Env
});
