"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

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

// start/kernel.ts
var import_reflect_metadata = require("reflect-metadata");

// app/exceptions/application.ts
var ApplicationException = class _ApplicationException extends Error {
  constructor(payload) {
    super(payload.message);
    this.cause = payload.cause;
    this.code = payload.code;
  }
  // Métodos estáticos para cada código HTTP de erro 4xx e 5xx
  // 4xx Client Errors
  static BadRequest(message = "Bad Request", cause = "INVALID_PARAMETERS") {
    return new _ApplicationException({ message, code: 400, cause });
  }
  static Unauthorized(message = "Unauthorized", cause = "AUTHENTICATION_REQUIRED") {
    return new _ApplicationException({ message, code: 401, cause });
  }
  static PaymentRequired(message = "Payment Required", cause = "PAYMENT_REQUIRED") {
    return new _ApplicationException({ message, code: 402, cause });
  }
  static Forbidden(message = "Forbidden", cause = "ACCESS_DENIED") {
    return new _ApplicationException({ message, code: 403, cause });
  }
  static NotFound(message = "Not Found", cause = "RESOURCE_NOT_FOUND") {
    return new _ApplicationException({ message, code: 404, cause });
  }
  static MethodNotAllowed(message = "Method Not Allowed", cause = "INVALID_HTTP_METHOD") {
    return new _ApplicationException({ message, code: 405, cause });
  }
  static NotAcceptable(message = "Not Acceptable", cause = "REQUEST_NOT_ACCEPTABLE") {
    return new _ApplicationException({ message, code: 406, cause });
  }
  static ProxyAuthenticationRequired(message = "Proxy Authentication Required", cause = "PROXY_AUTHENTICATION_REQUIRED") {
    return new _ApplicationException({ message, code: 407, cause });
  }
  static RequestTimeout(message = "Request Timeout", cause = "REQUEST_TIMEOUT") {
    return new _ApplicationException({ message, code: 408, cause });
  }
  static Conflict(message = "Conflict", cause = "CONFLICT_IN_REQUEST") {
    return new _ApplicationException({ message, code: 409, cause });
  }
  static Gone(message = "Gone", cause = "RESOURCE_GONE") {
    return new _ApplicationException({ message, code: 410, cause });
  }
  static LengthRequired(message = "Length Required", cause = "CONTENT_LENGTH_REQUIRED") {
    return new _ApplicationException({ message, code: 411, cause });
  }
  static PreconditionFailed(message = "Precondition Failed", cause = "PRECONDITION_NOT_MET") {
    return new _ApplicationException({ message, code: 412, cause });
  }
  static PayloadTooLarge(message = "Payload Too Large", cause = "PAYLOAD_TOO_LARGE") {
    return new _ApplicationException({ message, code: 413, cause });
  }
  static URITooLong(message = "URI Too Long", cause = "URI_TOO_LONG") {
    return new _ApplicationException({ message, code: 414, cause });
  }
  static UnsupportedMediaType(message = "Unsupported Media Type", cause = "UNSUPPORTED_MEDIA_TYPE") {
    return new _ApplicationException({ message, code: 415, cause });
  }
  static RangeNotSatisfiable(message = "Range Not Satisfiable", cause = "RANGE_NOT_SATISFIABLE") {
    return new _ApplicationException({ message, code: 416, cause });
  }
  static ExpectationFailed(message = "Expectation Failed", cause = "EXPECTATION_FAILED") {
    return new _ApplicationException({ message, code: 417, cause });
  }
  static IAmATeapot(message = "I'm a teapot", cause = "TEAPOT_ERROR") {
    return new _ApplicationException({ message, code: 418, cause });
  }
  static MisdirectedRequest(message = "Misdirected Request", cause = "MISDIRECTED_REQUEST") {
    return new _ApplicationException({ message, code: 421, cause });
  }
  static UnprocessableEntity(message = "Unprocessable Entity", cause = "UNPROCESSABLE_ENTITY") {
    return new _ApplicationException({ message, code: 422, cause });
  }
  static Locked(message = "Locked", cause = "RESOURCE_LOCKED") {
    return new _ApplicationException({ message, code: 423, cause });
  }
  static FailedDependency(message = "Failed Dependency", cause = "FAILED_DEPENDENCY") {
    return new _ApplicationException({ message, code: 424, cause });
  }
  static TooEarly(message = "Too Early", cause = "TOO_EARLY") {
    return new _ApplicationException({ message, code: 425, cause });
  }
  static UpgradeRequired(message = "Upgrade Required", cause = "UPGRADE_REQUIRED") {
    return new _ApplicationException({ message, code: 426, cause });
  }
  static PreconditionRequired(message = "Precondition Required", cause = "PRECONDITION_REQUIRED") {
    return new _ApplicationException({ message, code: 428, cause });
  }
  static TooManyRequests(message = "Too Many Requests", cause = "TOO_MANY_REQUESTS") {
    return new _ApplicationException({ message, code: 429, cause });
  }
  static RequestHeaderFieldsTooLarge(message = "Request Header Fields Too Large", cause = "HEADER_FIELDS_TOO_LARGE") {
    return new _ApplicationException({ message, code: 431, cause });
  }
  static UnavailableForLegalReasons(message = "Unavailable For Legal Reasons", cause = "LEGAL_RESTRICTIONS") {
    return new _ApplicationException({ message, code: 451, cause });
  }
  // 5xx Server Errors
  static InternalServerError(message = "Internal Server Error", cause = "SERVER_ERROR") {
    return new _ApplicationException({ message, code: 500, cause });
  }
  static NotImplemented(message = "Not Implemented", cause = "NOT_IMPLEMENTED") {
    return new _ApplicationException({ message, code: 501, cause });
  }
  static BadGateway(message = "Bad Gateway", cause = "BAD_GATEWAY") {
    return new _ApplicationException({ message, code: 502, cause });
  }
  static ServiceUnavailable(message = "Service Unavailable", cause = "SERVICE_UNAVAILABLE") {
    return new _ApplicationException({ message, code: 503, cause });
  }
  static GatewayTimeout(message = "Gateway Timeout", cause = "GATEWAY_TIMEOUT") {
    return new _ApplicationException({ message, code: 504, cause });
  }
  static HTTPVersionNotSupported(message = "HTTP Version Not Supported", cause = "HTTP_VERSION_NOT_SUPPORTED") {
    return new _ApplicationException({ message, code: 505, cause });
  }
  static VariantAlsoNegotiates(message = "Variant Also Negotiates", cause = "VARIANT_NEGOTIATION_ERROR") {
    return new _ApplicationException({ message, code: 506, cause });
  }
  static InsufficientStorage(message = "Insufficient Storage", cause = "INSUFFICIENT_STORAGE") {
    return new _ApplicationException({ message, code: 507, cause });
  }
  static LoopDetected(message = "Loop Detected", cause = "LOOP_DETECTED") {
    return new _ApplicationException({ message, code: 508, cause });
  }
  static NotExtended(message = "Not Extended", cause = "NOT_EXTENDED") {
    return new _ApplicationException({ message, code: 510, cause });
  }
  static NetworkAuthenticationRequired(message = "Network Authentication Required", cause = "NETWORK_AUTHENTICATION_REQUIRED") {
    return new _ApplicationException({ message, code: 511, cause });
  }
};

// start/kernel.ts
var import_cookie = __toESM(require("@fastify/cookie"));
var import_cors = __toESM(require("@fastify/cors"));
var import_jwt = __toESM(require("@fastify/jwt"));
var import_fastify = __toESM(require("fastify"));
var import_fastify_decorators = require("fastify-decorators");
var import_fastify_type_provider_zod = require("fastify-type-provider-zod");
var import_path = require("path");
var import_zod2 = require("zod");
var kernel = (0, import_fastify.default)({
  logger: false
}).withTypeProvider();
kernel.setValidatorCompiler(import_fastify_type_provider_zod.validatorCompiler);
kernel.setSerializerCompiler(import_fastify_type_provider_zod.serializerCompiler);
kernel.register(import_cors.default, {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "https://www.manganga.maiyu.com.br",
      "http://localhost:5173"
    ];
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"), false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Cookie",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Access-Control-Request-Method",
    "Access-Control-Request-Headers"
  ],
  exposedHeaders: ["Set-Cookie"],
  optionsSuccessStatus: 200,
  preflightContinue: false,
  preflight: true
});
kernel.register(import_cookie.default, {
  secret: Env.COOKIE_SECRET
});
var expiresIn = 60 * 60 * 24 * 1;
kernel.register(import_jwt.default, {
  secret: {
    private: Buffer.from(Env.JWT_PRIVATE_KEY, "base64"),
    public: Buffer.from(Env.JWT_PUBLIC_KEY, "base64")
  },
  sign: { expiresIn, algorithm: "RS256" },
  verify: { algorithms: ["RS256"] },
  cookie: {
    signed: false,
    cookieName: "accessToken"
  }
});
kernel.setErrorHandler((error, request, response) => {
  console.error("Error details:", JSON.stringify(error, null, 2));
  console.error("Request URL:", request.url);
  console.error("Request method:", request.method);
  console.error("Request headers:", request.headers);
  if (error instanceof ApplicationException) {
    return response.status(Number(error.code || 500)).send({
      message: error.message || "Internal Server Error",
      cause: error.cause || "SERVER_ERROR",
      code: Number(error.code || 500)
    });
  }
  if (error instanceof import_zod2.ZodError) {
    const errors = error?.issues?.map((issue) => ({
      message: issue.message
    }));
    return response.status(400).send({ errors });
  }
  return response.status(500).send({ message: "Internal server error" });
});
kernel.register(import_fastify_decorators.bootstrap, {
  directory: (0, import_path.resolve)(__dirname, "..", "app", "controllers"),
  mask: /\.controller\.(t|j)s$/
});

// bin/server.ts
async function start() {
  kernel.listen({ port: Env.PORT, host: "0.0.0.0" }).then(() => {
    console.info(`HTTP Server running on http://localhost:${Env.PORT}`);
  });
}
start();
