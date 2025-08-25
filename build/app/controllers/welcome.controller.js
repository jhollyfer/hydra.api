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

// app/controllers/welcome.controller.ts
var welcome_controller_exports = {};
__export(welcome_controller_exports, {
  default: () => WelcomeController
});
module.exports = __toCommonJS(welcome_controller_exports);
var import_fastify_decorators = require("fastify-decorators");
var WelcomeController = class {
  async handle(request, response) {
    return response.status(200).send({ message: "Welcome to the Hydra API" });
  }
};
__decorateClass([
  (0, import_fastify_decorators.GET)({
    url: "/"
  })
], WelcomeController.prototype, "handle", 1);
WelcomeController = __decorateClass([
  (0, import_fastify_decorators.Controller)({
    route: "/"
  })
], WelcomeController);
