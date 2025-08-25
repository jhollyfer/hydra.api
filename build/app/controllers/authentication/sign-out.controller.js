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
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};

// app/controllers/authentication/sign-out.controller.ts
var sign_out_controller_exports = {};
__export(sign_out_controller_exports, {
  default: () => SignOutController
});
module.exports = __toCommonJS(sign_out_controller_exports);

// app/middlewares/authentication.middleware.ts
async function AuthenticationMiddleware(request, response) {
  try {
    const decoded = await request.jwtVerify();
    request.user = {
      sub: decoded.sub ?? void 0,
      email: decoded?.email ?? void 0,
      name: decoded?.name ?? void 0
    };
  } catch (error) {
    console.error(error);
    return response.status(401).send({
      statusCode: 401,
      error: "N\xE3o autorizado",
      message: "Usu\xE1rio n\xE3o autenticado"
    });
  }
}

// start/env.ts
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

// app/controllers/authentication/sign-out.controller.ts
var import_fastify_decorators = require("fastify-decorators");
var SignOutController = class {
  async handle(request, response) {
    const cookieOptions = {
      path: "/",
      secure: Env.NODE_ENV === "production",
      sameSite: "lax",
      httpOnly: true
    };
    response.setCookie("accessToken", "", {
      ...cookieOptions,
      maxAge: 0
    }).setCookie("refreshToken", "", {
      ...cookieOptions,
      maxAge: 0
    });
    return response.status(200).send();
  }
};
__decorateClass([
  (0, import_fastify_decorators.POST)({
    url: "/sign-out",
    options: {
      onRequest: [AuthenticationMiddleware]
    }
  })
], SignOutController.prototype, "handle", 1);
SignOutController = __decorateClass([
  (0, import_fastify_decorators.Controller)({
    route: "authentication"
  })
], SignOutController);
