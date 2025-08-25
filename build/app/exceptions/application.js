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

// app/exceptions/application.ts
var application_exports = {};
__export(application_exports, {
  default: () => ApplicationException
});
module.exports = __toCommonJS(application_exports);
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
