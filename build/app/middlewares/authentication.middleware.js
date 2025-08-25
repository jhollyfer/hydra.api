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

// app/middlewares/authentication.middleware.ts
var authentication_middleware_exports = {};
__export(authentication_middleware_exports, {
  AuthenticationMiddleware: () => AuthenticationMiddleware
});
module.exports = __toCommonJS(authentication_middleware_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuthenticationMiddleware
});
