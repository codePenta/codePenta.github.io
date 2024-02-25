/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@octokit/auth-token/dist-web/index.js":
/*!************************************************************!*\
  !*** ./node_modules/@octokit/auth-token/dist-web/index.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createTokenAuth: () => (/* binding */ createTokenAuth)
/* harmony export */ });
// pkg/dist-src/auth.js
var REGEX_IS_INSTALLATION_LEGACY = /^v1\./;
var REGEX_IS_INSTALLATION = /^ghs_/;
var REGEX_IS_USER_TO_SERVER = /^ghu_/;
async function auth(token) {
  const isApp = token.split(/\./).length === 3;
  const isInstallation = REGEX_IS_INSTALLATION_LEGACY.test(token) || REGEX_IS_INSTALLATION.test(token);
  const isUserToServer = REGEX_IS_USER_TO_SERVER.test(token);
  const tokenType = isApp ? "app" : isInstallation ? "installation" : isUserToServer ? "user-to-server" : "oauth";
  return {
    type: "token",
    token,
    tokenType
  };
}

// pkg/dist-src/with-authorization-prefix.js
function withAuthorizationPrefix(token) {
  if (token.split(/\./).length === 3) {
    return `bearer ${token}`;
  }
  return `token ${token}`;
}

// pkg/dist-src/hook.js
async function hook(token, request, route, parameters) {
  const endpoint = request.endpoint.merge(
    route,
    parameters
  );
  endpoint.headers.authorization = withAuthorizationPrefix(token);
  return request(endpoint);
}

// pkg/dist-src/index.js
var createTokenAuth = function createTokenAuth2(token) {
  if (!token) {
    throw new Error("[@octokit/auth-token] No token passed to createTokenAuth");
  }
  if (typeof token !== "string") {
    throw new Error(
      "[@octokit/auth-token] Token passed to createTokenAuth is not a string"
    );
  }
  token = token.replace(/^(token|bearer) +/i, "");
  return Object.assign(auth.bind(null, token), {
    hook: hook.bind(null, token)
  });
};



/***/ }),

/***/ "./node_modules/@octokit/core/dist-web/index.js":
/*!******************************************************!*\
  !*** ./node_modules/@octokit/core/dist-web/index.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Octokit: () => (/* binding */ Octokit)
/* harmony export */ });
/* harmony import */ var universal_user_agent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! universal-user-agent */ "./node_modules/universal-user-agent/dist-web/index.js");
/* harmony import */ var before_after_hook__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! before-after-hook */ "./node_modules/before-after-hook/index.js");
/* harmony import */ var before_after_hook__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(before_after_hook__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _octokit_request__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @octokit/request */ "./node_modules/@octokit/request/dist-web/index.js");
/* harmony import */ var _octokit_graphql__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @octokit/graphql */ "./node_modules/@octokit/graphql/dist-web/index.js");
/* harmony import */ var _octokit_auth_token__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @octokit/auth-token */ "./node_modules/@octokit/auth-token/dist-web/index.js");
// pkg/dist-src/index.js






// pkg/dist-src/version.js
var VERSION = "5.1.0";

// pkg/dist-src/index.js
var noop = () => {
};
var consoleWarn = console.warn.bind(console);
var consoleError = console.error.bind(console);
var userAgentTrail = `octokit-core.js/${VERSION} ${(0,universal_user_agent__WEBPACK_IMPORTED_MODULE_1__.getUserAgent)()}`;
var Octokit = class {
  static {
    this.VERSION = VERSION;
  }
  static defaults(defaults) {
    const OctokitWithDefaults = class extends this {
      constructor(...args) {
        const options = args[0] || {};
        if (typeof defaults === "function") {
          super(defaults(options));
          return;
        }
        super(
          Object.assign(
            {},
            defaults,
            options,
            options.userAgent && defaults.userAgent ? {
              userAgent: `${options.userAgent} ${defaults.userAgent}`
            } : null
          )
        );
      }
    };
    return OctokitWithDefaults;
  }
  static {
    this.plugins = [];
  }
  /**
   * Attach a plugin (or many) to your Octokit instance.
   *
   * @example
   * const API = Octokit.plugin(plugin1, plugin2, plugin3, ...)
   */
  static plugin(...newPlugins) {
    const currentPlugins = this.plugins;
    const NewOctokit = class extends this {
      static {
        this.plugins = currentPlugins.concat(
          newPlugins.filter((plugin) => !currentPlugins.includes(plugin))
        );
      }
    };
    return NewOctokit;
  }
  constructor(options = {}) {
    const hook = new before_after_hook__WEBPACK_IMPORTED_MODULE_0__.Collection();
    const requestDefaults = {
      baseUrl: _octokit_request__WEBPACK_IMPORTED_MODULE_2__.request.endpoint.DEFAULTS.baseUrl,
      headers: {},
      request: Object.assign({}, options.request, {
        // @ts-ignore internal usage only, no need to type
        hook: hook.bind(null, "request")
      }),
      mediaType: {
        previews: [],
        format: ""
      }
    };
    requestDefaults.headers["user-agent"] = options.userAgent ? `${options.userAgent} ${userAgentTrail}` : userAgentTrail;
    if (options.baseUrl) {
      requestDefaults.baseUrl = options.baseUrl;
    }
    if (options.previews) {
      requestDefaults.mediaType.previews = options.previews;
    }
    if (options.timeZone) {
      requestDefaults.headers["time-zone"] = options.timeZone;
    }
    this.request = _octokit_request__WEBPACK_IMPORTED_MODULE_2__.request.defaults(requestDefaults);
    this.graphql = (0,_octokit_graphql__WEBPACK_IMPORTED_MODULE_3__.withCustomRequest)(this.request).defaults(requestDefaults);
    this.log = Object.assign(
      {
        debug: noop,
        info: noop,
        warn: consoleWarn,
        error: consoleError
      },
      options.log
    );
    this.hook = hook;
    if (!options.authStrategy) {
      if (!options.auth) {
        this.auth = async () => ({
          type: "unauthenticated"
        });
      } else {
        const auth = (0,_octokit_auth_token__WEBPACK_IMPORTED_MODULE_4__.createTokenAuth)(options.auth);
        hook.wrap("request", auth.hook);
        this.auth = auth;
      }
    } else {
      const { authStrategy, ...otherOptions } = options;
      const auth = authStrategy(
        Object.assign(
          {
            request: this.request,
            log: this.log,
            // we pass the current octokit instance as well as its constructor options
            // to allow for authentication strategies that return a new octokit instance
            // that shares the same internal state as the current one. The original
            // requirement for this was the "event-octokit" authentication strategy
            // of https://github.com/probot/octokit-auth-probot.
            octokit: this,
            octokitOptions: otherOptions
          },
          options.auth
        )
      );
      hook.wrap("request", auth.hook);
      this.auth = auth;
    }
    const classConstructor = this.constructor;
    for (let i = 0; i < classConstructor.plugins.length; ++i) {
      Object.assign(this, classConstructor.plugins[i](this, options));
    }
  }
};



/***/ }),

/***/ "./node_modules/@octokit/endpoint/dist-web/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/@octokit/endpoint/dist-web/index.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   endpoint: () => (/* binding */ endpoint)
/* harmony export */ });
/* harmony import */ var universal_user_agent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! universal-user-agent */ "./node_modules/universal-user-agent/dist-web/index.js");
// pkg/dist-src/defaults.js


// pkg/dist-src/version.js
var VERSION = "9.0.4";

// pkg/dist-src/defaults.js
var userAgent = `octokit-endpoint.js/${VERSION} ${(0,universal_user_agent__WEBPACK_IMPORTED_MODULE_0__.getUserAgent)()}`;
var DEFAULTS = {
  method: "GET",
  baseUrl: "https://api.github.com",
  headers: {
    accept: "application/vnd.github.v3+json",
    "user-agent": userAgent
  },
  mediaType: {
    format: ""
  }
};

// pkg/dist-src/util/lowercase-keys.js
function lowercaseKeys(object) {
  if (!object) {
    return {};
  }
  return Object.keys(object).reduce((newObj, key) => {
    newObj[key.toLowerCase()] = object[key];
    return newObj;
  }, {});
}

// pkg/dist-src/util/is-plain-object.js
function isPlainObject(value) {
  if (typeof value !== "object" || value === null)
    return false;
  if (Object.prototype.toString.call(value) !== "[object Object]")
    return false;
  const proto = Object.getPrototypeOf(value);
  if (proto === null)
    return true;
  const Ctor = Object.prototype.hasOwnProperty.call(proto, "constructor") && proto.constructor;
  return typeof Ctor === "function" && Ctor instanceof Ctor && Function.prototype.call(Ctor) === Function.prototype.call(value);
}

// pkg/dist-src/util/merge-deep.js
function mergeDeep(defaults, options) {
  const result = Object.assign({}, defaults);
  Object.keys(options).forEach((key) => {
    if (isPlainObject(options[key])) {
      if (!(key in defaults))
        Object.assign(result, { [key]: options[key] });
      else
        result[key] = mergeDeep(defaults[key], options[key]);
    } else {
      Object.assign(result, { [key]: options[key] });
    }
  });
  return result;
}

// pkg/dist-src/util/remove-undefined-properties.js
function removeUndefinedProperties(obj) {
  for (const key in obj) {
    if (obj[key] === void 0) {
      delete obj[key];
    }
  }
  return obj;
}

// pkg/dist-src/merge.js
function merge(defaults, route, options) {
  if (typeof route === "string") {
    let [method, url] = route.split(" ");
    options = Object.assign(url ? { method, url } : { url: method }, options);
  } else {
    options = Object.assign({}, route);
  }
  options.headers = lowercaseKeys(options.headers);
  removeUndefinedProperties(options);
  removeUndefinedProperties(options.headers);
  const mergedOptions = mergeDeep(defaults || {}, options);
  if (options.url === "/graphql") {
    if (defaults && defaults.mediaType.previews?.length) {
      mergedOptions.mediaType.previews = defaults.mediaType.previews.filter(
        (preview) => !mergedOptions.mediaType.previews.includes(preview)
      ).concat(mergedOptions.mediaType.previews);
    }
    mergedOptions.mediaType.previews = (mergedOptions.mediaType.previews || []).map((preview) => preview.replace(/-preview/, ""));
  }
  return mergedOptions;
}

// pkg/dist-src/util/add-query-parameters.js
function addQueryParameters(url, parameters) {
  const separator = /\?/.test(url) ? "&" : "?";
  const names = Object.keys(parameters);
  if (names.length === 0) {
    return url;
  }
  return url + separator + names.map((name) => {
    if (name === "q") {
      return "q=" + parameters.q.split("+").map(encodeURIComponent).join("+");
    }
    return `${name}=${encodeURIComponent(parameters[name])}`;
  }).join("&");
}

// pkg/dist-src/util/extract-url-variable-names.js
var urlVariableRegex = /\{[^}]+\}/g;
function removeNonChars(variableName) {
  return variableName.replace(/^\W+|\W+$/g, "").split(/,/);
}
function extractUrlVariableNames(url) {
  const matches = url.match(urlVariableRegex);
  if (!matches) {
    return [];
  }
  return matches.map(removeNonChars).reduce((a, b) => a.concat(b), []);
}

// pkg/dist-src/util/omit.js
function omit(object, keysToOmit) {
  const result = { __proto__: null };
  for (const key of Object.keys(object)) {
    if (keysToOmit.indexOf(key) === -1) {
      result[key] = object[key];
    }
  }
  return result;
}

// pkg/dist-src/util/url-template.js
function encodeReserved(str) {
  return str.split(/(%[0-9A-Fa-f]{2})/g).map(function(part) {
    if (!/%[0-9A-Fa-f]/.test(part)) {
      part = encodeURI(part).replace(/%5B/g, "[").replace(/%5D/g, "]");
    }
    return part;
  }).join("");
}
function encodeUnreserved(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
    return "%" + c.charCodeAt(0).toString(16).toUpperCase();
  });
}
function encodeValue(operator, value, key) {
  value = operator === "+" || operator === "#" ? encodeReserved(value) : encodeUnreserved(value);
  if (key) {
    return encodeUnreserved(key) + "=" + value;
  } else {
    return value;
  }
}
function isDefined(value) {
  return value !== void 0 && value !== null;
}
function isKeyOperator(operator) {
  return operator === ";" || operator === "&" || operator === "?";
}
function getValues(context, operator, key, modifier) {
  var value = context[key], result = [];
  if (isDefined(value) && value !== "") {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      value = value.toString();
      if (modifier && modifier !== "*") {
        value = value.substring(0, parseInt(modifier, 10));
      }
      result.push(
        encodeValue(operator, value, isKeyOperator(operator) ? key : "")
      );
    } else {
      if (modifier === "*") {
        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function(value2) {
            result.push(
              encodeValue(operator, value2, isKeyOperator(operator) ? key : "")
            );
          });
        } else {
          Object.keys(value).forEach(function(k) {
            if (isDefined(value[k])) {
              result.push(encodeValue(operator, value[k], k));
            }
          });
        }
      } else {
        const tmp = [];
        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function(value2) {
            tmp.push(encodeValue(operator, value2));
          });
        } else {
          Object.keys(value).forEach(function(k) {
            if (isDefined(value[k])) {
              tmp.push(encodeUnreserved(k));
              tmp.push(encodeValue(operator, value[k].toString()));
            }
          });
        }
        if (isKeyOperator(operator)) {
          result.push(encodeUnreserved(key) + "=" + tmp.join(","));
        } else if (tmp.length !== 0) {
          result.push(tmp.join(","));
        }
      }
    }
  } else {
    if (operator === ";") {
      if (isDefined(value)) {
        result.push(encodeUnreserved(key));
      }
    } else if (value === "" && (operator === "&" || operator === "?")) {
      result.push(encodeUnreserved(key) + "=");
    } else if (value === "") {
      result.push("");
    }
  }
  return result;
}
function parseUrl(template) {
  return {
    expand: expand.bind(null, template)
  };
}
function expand(template, context) {
  var operators = ["+", "#", ".", "/", ";", "?", "&"];
  template = template.replace(
    /\{([^\{\}]+)\}|([^\{\}]+)/g,
    function(_, expression, literal) {
      if (expression) {
        let operator = "";
        const values = [];
        if (operators.indexOf(expression.charAt(0)) !== -1) {
          operator = expression.charAt(0);
          expression = expression.substr(1);
        }
        expression.split(/,/g).forEach(function(variable) {
          var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
          values.push(getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
        });
        if (operator && operator !== "+") {
          var separator = ",";
          if (operator === "?") {
            separator = "&";
          } else if (operator !== "#") {
            separator = operator;
          }
          return (values.length !== 0 ? operator : "") + values.join(separator);
        } else {
          return values.join(",");
        }
      } else {
        return encodeReserved(literal);
      }
    }
  );
  if (template === "/") {
    return template;
  } else {
    return template.replace(/\/$/, "");
  }
}

// pkg/dist-src/parse.js
function parse(options) {
  let method = options.method.toUpperCase();
  let url = (options.url || "/").replace(/:([a-z]\w+)/g, "{$1}");
  let headers = Object.assign({}, options.headers);
  let body;
  let parameters = omit(options, [
    "method",
    "baseUrl",
    "url",
    "headers",
    "request",
    "mediaType"
  ]);
  const urlVariableNames = extractUrlVariableNames(url);
  url = parseUrl(url).expand(parameters);
  if (!/^http/.test(url)) {
    url = options.baseUrl + url;
  }
  const omittedParameters = Object.keys(options).filter((option) => urlVariableNames.includes(option)).concat("baseUrl");
  const remainingParameters = omit(parameters, omittedParameters);
  const isBinaryRequest = /application\/octet-stream/i.test(headers.accept);
  if (!isBinaryRequest) {
    if (options.mediaType.format) {
      headers.accept = headers.accept.split(/,/).map(
        (format) => format.replace(
          /application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/,
          `application/vnd$1$2.${options.mediaType.format}`
        )
      ).join(",");
    }
    if (url.endsWith("/graphql")) {
      if (options.mediaType.previews?.length) {
        const previewsFromAcceptHeader = headers.accept.match(/[\w-]+(?=-preview)/g) || [];
        headers.accept = previewsFromAcceptHeader.concat(options.mediaType.previews).map((preview) => {
          const format = options.mediaType.format ? `.${options.mediaType.format}` : "+json";
          return `application/vnd.github.${preview}-preview${format}`;
        }).join(",");
      }
    }
  }
  if (["GET", "HEAD"].includes(method)) {
    url = addQueryParameters(url, remainingParameters);
  } else {
    if ("data" in remainingParameters) {
      body = remainingParameters.data;
    } else {
      if (Object.keys(remainingParameters).length) {
        body = remainingParameters;
      }
    }
  }
  if (!headers["content-type"] && typeof body !== "undefined") {
    headers["content-type"] = "application/json; charset=utf-8";
  }
  if (["PATCH", "PUT"].includes(method) && typeof body === "undefined") {
    body = "";
  }
  return Object.assign(
    { method, url, headers },
    typeof body !== "undefined" ? { body } : null,
    options.request ? { request: options.request } : null
  );
}

// pkg/dist-src/endpoint-with-defaults.js
function endpointWithDefaults(defaults, route, options) {
  return parse(merge(defaults, route, options));
}

// pkg/dist-src/with-defaults.js
function withDefaults(oldDefaults, newDefaults) {
  const DEFAULTS2 = merge(oldDefaults, newDefaults);
  const endpoint2 = endpointWithDefaults.bind(null, DEFAULTS2);
  return Object.assign(endpoint2, {
    DEFAULTS: DEFAULTS2,
    defaults: withDefaults.bind(null, DEFAULTS2),
    merge: merge.bind(null, DEFAULTS2),
    parse
  });
}

// pkg/dist-src/index.js
var endpoint = withDefaults(null, DEFAULTS);



/***/ }),

/***/ "./node_modules/@octokit/graphql/dist-web/index.js":
/*!*********************************************************!*\
  !*** ./node_modules/@octokit/graphql/dist-web/index.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GraphqlResponseError: () => (/* binding */ GraphqlResponseError),
/* harmony export */   graphql: () => (/* binding */ graphql2),
/* harmony export */   withCustomRequest: () => (/* binding */ withCustomRequest)
/* harmony export */ });
/* harmony import */ var _octokit_request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @octokit/request */ "./node_modules/@octokit/request/dist-web/index.js");
/* harmony import */ var universal_user_agent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! universal-user-agent */ "./node_modules/universal-user-agent/dist-web/index.js");
// pkg/dist-src/index.js



// pkg/dist-src/version.js
var VERSION = "7.0.2";

// pkg/dist-src/with-defaults.js


// pkg/dist-src/graphql.js


// pkg/dist-src/error.js
function _buildMessageForResponseErrors(data) {
  return `Request failed due to following response errors:
` + data.errors.map((e) => ` - ${e.message}`).join("\n");
}
var GraphqlResponseError = class extends Error {
  constructor(request2, headers, response) {
    super(_buildMessageForResponseErrors(response));
    this.request = request2;
    this.headers = headers;
    this.response = response;
    this.name = "GraphqlResponseError";
    this.errors = response.errors;
    this.data = response.data;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};

// pkg/dist-src/graphql.js
var NON_VARIABLE_OPTIONS = [
  "method",
  "baseUrl",
  "url",
  "headers",
  "request",
  "query",
  "mediaType"
];
var FORBIDDEN_VARIABLE_OPTIONS = ["query", "method", "url"];
var GHES_V3_SUFFIX_REGEX = /\/api\/v3\/?$/;
function graphql(request2, query, options) {
  if (options) {
    if (typeof query === "string" && "query" in options) {
      return Promise.reject(
        new Error(`[@octokit/graphql] "query" cannot be used as variable name`)
      );
    }
    for (const key in options) {
      if (!FORBIDDEN_VARIABLE_OPTIONS.includes(key))
        continue;
      return Promise.reject(
        new Error(
          `[@octokit/graphql] "${key}" cannot be used as variable name`
        )
      );
    }
  }
  const parsedOptions = typeof query === "string" ? Object.assign({ query }, options) : query;
  const requestOptions = Object.keys(
    parsedOptions
  ).reduce((result, key) => {
    if (NON_VARIABLE_OPTIONS.includes(key)) {
      result[key] = parsedOptions[key];
      return result;
    }
    if (!result.variables) {
      result.variables = {};
    }
    result.variables[key] = parsedOptions[key];
    return result;
  }, {});
  const baseUrl = parsedOptions.baseUrl || request2.endpoint.DEFAULTS.baseUrl;
  if (GHES_V3_SUFFIX_REGEX.test(baseUrl)) {
    requestOptions.url = baseUrl.replace(GHES_V3_SUFFIX_REGEX, "/api/graphql");
  }
  return request2(requestOptions).then((response) => {
    if (response.data.errors) {
      const headers = {};
      for (const key of Object.keys(response.headers)) {
        headers[key] = response.headers[key];
      }
      throw new GraphqlResponseError(
        requestOptions,
        headers,
        response.data
      );
    }
    return response.data.data;
  });
}

// pkg/dist-src/with-defaults.js
function withDefaults(request2, newDefaults) {
  const newRequest = request2.defaults(newDefaults);
  const newApi = (query, options) => {
    return graphql(newRequest, query, options);
  };
  return Object.assign(newApi, {
    defaults: withDefaults.bind(null, newRequest),
    endpoint: newRequest.endpoint
  });
}

// pkg/dist-src/index.js
var graphql2 = withDefaults(_octokit_request__WEBPACK_IMPORTED_MODULE_0__.request, {
  headers: {
    "user-agent": `octokit-graphql.js/${VERSION} ${(0,universal_user_agent__WEBPACK_IMPORTED_MODULE_1__.getUserAgent)()}`
  },
  method: "POST",
  url: "/graphql"
});
function withCustomRequest(customRequest) {
  return withDefaults(customRequest, {
    method: "POST",
    url: "/graphql"
  });
}



/***/ }),

/***/ "./node_modules/@octokit/request-error/dist-web/index.js":
/*!***************************************************************!*\
  !*** ./node_modules/@octokit/request-error/dist-web/index.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RequestError: () => (/* binding */ RequestError)
/* harmony export */ });
/* harmony import */ var deprecation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! deprecation */ "./node_modules/deprecation/dist-web/index.js");
/* harmony import */ var once__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! once */ "./node_modules/once/once.js");
/* harmony import */ var once__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(once__WEBPACK_IMPORTED_MODULE_0__);
// pkg/dist-src/index.js


var logOnceCode = once__WEBPACK_IMPORTED_MODULE_0___default()((deprecation) => console.warn(deprecation));
var logOnceHeaders = once__WEBPACK_IMPORTED_MODULE_0___default()((deprecation) => console.warn(deprecation));
var RequestError = class extends Error {
  constructor(message, statusCode, options) {
    super(message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    this.name = "HttpError";
    this.status = statusCode;
    let headers;
    if ("headers" in options && typeof options.headers !== "undefined") {
      headers = options.headers;
    }
    if ("response" in options) {
      this.response = options.response;
      headers = options.response.headers;
    }
    const requestCopy = Object.assign({}, options.request);
    if (options.request.headers.authorization) {
      requestCopy.headers = Object.assign({}, options.request.headers, {
        authorization: options.request.headers.authorization.replace(
          / .*$/,
          " [REDACTED]"
        )
      });
    }
    requestCopy.url = requestCopy.url.replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]").replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
    this.request = requestCopy;
    Object.defineProperty(this, "code", {
      get() {
        logOnceCode(
          new deprecation__WEBPACK_IMPORTED_MODULE_1__.Deprecation(
            "[@octokit/request-error] `error.code` is deprecated, use `error.status`."
          )
        );
        return statusCode;
      }
    });
    Object.defineProperty(this, "headers", {
      get() {
        logOnceHeaders(
          new deprecation__WEBPACK_IMPORTED_MODULE_1__.Deprecation(
            "[@octokit/request-error] `error.headers` is deprecated, use `error.response.headers`."
          )
        );
        return headers || {};
      }
    });
  }
};



/***/ }),

/***/ "./node_modules/@octokit/request/dist-web/index.js":
/*!*********************************************************!*\
  !*** ./node_modules/@octokit/request/dist-web/index.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   request: () => (/* binding */ request)
/* harmony export */ });
/* harmony import */ var _octokit_endpoint__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @octokit/endpoint */ "./node_modules/@octokit/endpoint/dist-web/index.js");
/* harmony import */ var universal_user_agent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! universal-user-agent */ "./node_modules/universal-user-agent/dist-web/index.js");
/* harmony import */ var _octokit_request_error__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @octokit/request-error */ "./node_modules/@octokit/request-error/dist-web/index.js");
// pkg/dist-src/index.js



// pkg/dist-src/version.js
var VERSION = "8.2.0";

// pkg/dist-src/is-plain-object.js
function isPlainObject(value) {
  if (typeof value !== "object" || value === null)
    return false;
  if (Object.prototype.toString.call(value) !== "[object Object]")
    return false;
  const proto = Object.getPrototypeOf(value);
  if (proto === null)
    return true;
  const Ctor = Object.prototype.hasOwnProperty.call(proto, "constructor") && proto.constructor;
  return typeof Ctor === "function" && Ctor instanceof Ctor && Function.prototype.call(Ctor) === Function.prototype.call(value);
}

// pkg/dist-src/fetch-wrapper.js


// pkg/dist-src/get-buffer-response.js
function getBufferResponse(response) {
  return response.arrayBuffer();
}

// pkg/dist-src/fetch-wrapper.js
function fetchWrapper(requestOptions) {
  const log = requestOptions.request && requestOptions.request.log ? requestOptions.request.log : console;
  const parseSuccessResponseBody = requestOptions.request?.parseSuccessResponseBody !== false;
  if (isPlainObject(requestOptions.body) || Array.isArray(requestOptions.body)) {
    requestOptions.body = JSON.stringify(requestOptions.body);
  }
  let headers = {};
  let status;
  let url;
  let { fetch } = globalThis;
  if (requestOptions.request?.fetch) {
    fetch = requestOptions.request.fetch;
  }
  if (!fetch) {
    throw new Error(
      "fetch is not set. Please pass a fetch implementation as new Octokit({ request: { fetch }}). Learn more at https://github.com/octokit/octokit.js/#fetch-missing"
    );
  }
  return fetch(requestOptions.url, {
    method: requestOptions.method,
    body: requestOptions.body,
    headers: requestOptions.headers,
    signal: requestOptions.request?.signal,
    // duplex must be set if request.body is ReadableStream or Async Iterables.
    // See https://fetch.spec.whatwg.org/#dom-requestinit-duplex.
    ...requestOptions.body && { duplex: "half" }
  }).then(async (response) => {
    url = response.url;
    status = response.status;
    for (const keyAndValue of response.headers) {
      headers[keyAndValue[0]] = keyAndValue[1];
    }
    if ("deprecation" in headers) {
      const matches = headers.link && headers.link.match(/<([^>]+)>; rel="deprecation"/);
      const deprecationLink = matches && matches.pop();
      log.warn(
        `[@octokit/request] "${requestOptions.method} ${requestOptions.url}" is deprecated. It is scheduled to be removed on ${headers.sunset}${deprecationLink ? `. See ${deprecationLink}` : ""}`
      );
    }
    if (status === 204 || status === 205) {
      return;
    }
    if (requestOptions.method === "HEAD") {
      if (status < 400) {
        return;
      }
      throw new _octokit_request_error__WEBPACK_IMPORTED_MODULE_0__.RequestError(response.statusText, status, {
        response: {
          url,
          status,
          headers,
          data: void 0
        },
        request: requestOptions
      });
    }
    if (status === 304) {
      throw new _octokit_request_error__WEBPACK_IMPORTED_MODULE_0__.RequestError("Not modified", status, {
        response: {
          url,
          status,
          headers,
          data: await getResponseData(response)
        },
        request: requestOptions
      });
    }
    if (status >= 400) {
      const data = await getResponseData(response);
      const error = new _octokit_request_error__WEBPACK_IMPORTED_MODULE_0__.RequestError(toErrorMessage(data), status, {
        response: {
          url,
          status,
          headers,
          data
        },
        request: requestOptions
      });
      throw error;
    }
    return parseSuccessResponseBody ? await getResponseData(response) : response.body;
  }).then((data) => {
    return {
      status,
      url,
      headers,
      data
    };
  }).catch((error) => {
    if (error instanceof _octokit_request_error__WEBPACK_IMPORTED_MODULE_0__.RequestError)
      throw error;
    else if (error.name === "AbortError")
      throw error;
    let message = error.message;
    if (error.name === "TypeError" && "cause" in error) {
      if (error.cause instanceof Error) {
        message = error.cause.message;
      } else if (typeof error.cause === "string") {
        message = error.cause;
      }
    }
    throw new _octokit_request_error__WEBPACK_IMPORTED_MODULE_0__.RequestError(message, 500, {
      request: requestOptions
    });
  });
}
async function getResponseData(response) {
  const contentType = response.headers.get("content-type");
  if (/application\/json/.test(contentType)) {
    return response.json().catch(() => response.text()).catch(() => "");
  }
  if (!contentType || /^text\/|charset=utf-8$/.test(contentType)) {
    return response.text();
  }
  return getBufferResponse(response);
}
function toErrorMessage(data) {
  if (typeof data === "string")
    return data;
  let suffix;
  if ("documentation_url" in data) {
    suffix = ` - ${data.documentation_url}`;
  } else {
    suffix = "";
  }
  if ("message" in data) {
    if (Array.isArray(data.errors)) {
      return `${data.message}: ${data.errors.map(JSON.stringify).join(", ")}${suffix}`;
    }
    return `${data.message}${suffix}`;
  }
  return `Unknown error: ${JSON.stringify(data)}`;
}

// pkg/dist-src/with-defaults.js
function withDefaults(oldEndpoint, newDefaults) {
  const endpoint2 = oldEndpoint.defaults(newDefaults);
  const newApi = function(route, parameters) {
    const endpointOptions = endpoint2.merge(route, parameters);
    if (!endpointOptions.request || !endpointOptions.request.hook) {
      return fetchWrapper(endpoint2.parse(endpointOptions));
    }
    const request2 = (route2, parameters2) => {
      return fetchWrapper(
        endpoint2.parse(endpoint2.merge(route2, parameters2))
      );
    };
    Object.assign(request2, {
      endpoint: endpoint2,
      defaults: withDefaults.bind(null, endpoint2)
    });
    return endpointOptions.request.hook(request2, endpointOptions);
  };
  return Object.assign(newApi, {
    endpoint: endpoint2,
    defaults: withDefaults.bind(null, endpoint2)
  });
}

// pkg/dist-src/index.js
var request = withDefaults(_octokit_endpoint__WEBPACK_IMPORTED_MODULE_1__.endpoint, {
  headers: {
    "user-agent": `octokit-request.js/${VERSION} ${(0,universal_user_agent__WEBPACK_IMPORTED_MODULE_2__.getUserAgent)()}`
  }
});



/***/ }),

/***/ "./node_modules/before-after-hook/index.js":
/*!*************************************************!*\
  !*** ./node_modules/before-after-hook/index.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var register = __webpack_require__(/*! ./lib/register */ "./node_modules/before-after-hook/lib/register.js");
var addHook = __webpack_require__(/*! ./lib/add */ "./node_modules/before-after-hook/lib/add.js");
var removeHook = __webpack_require__(/*! ./lib/remove */ "./node_modules/before-after-hook/lib/remove.js");

// bind with array of arguments: https://stackoverflow.com/a/21792913
var bind = Function.bind;
var bindable = bind.bind(bind);

function bindApi(hook, state, name) {
  var removeHookRef = bindable(removeHook, null).apply(
    null,
    name ? [state, name] : [state]
  );
  hook.api = { remove: removeHookRef };
  hook.remove = removeHookRef;
  ["before", "error", "after", "wrap"].forEach(function (kind) {
    var args = name ? [state, kind, name] : [state, kind];
    hook[kind] = hook.api[kind] = bindable(addHook, null).apply(null, args);
  });
}

function HookSingular() {
  var singularHookName = "h";
  var singularHookState = {
    registry: {},
  };
  var singularHook = register.bind(null, singularHookState, singularHookName);
  bindApi(singularHook, singularHookState, singularHookName);
  return singularHook;
}

function HookCollection() {
  var state = {
    registry: {},
  };

  var hook = register.bind(null, state);
  bindApi(hook, state);

  return hook;
}

var collectionHookDeprecationMessageDisplayed = false;
function Hook() {
  if (!collectionHookDeprecationMessageDisplayed) {
    console.warn(
      '[before-after-hook]: "Hook()" repurposing warning, use "Hook.Collection()". Read more: https://git.io/upgrade-before-after-hook-to-1.4'
    );
    collectionHookDeprecationMessageDisplayed = true;
  }
  return HookCollection();
}

Hook.Singular = HookSingular.bind();
Hook.Collection = HookCollection.bind();

module.exports = Hook;
// expose constructors as a named property for TypeScript
module.exports.Hook = Hook;
module.exports.Singular = Hook.Singular;
module.exports.Collection = Hook.Collection;


/***/ }),

/***/ "./node_modules/before-after-hook/lib/add.js":
/*!***************************************************!*\
  !*** ./node_modules/before-after-hook/lib/add.js ***!
  \***************************************************/
/***/ ((module) => {

module.exports = addHook;

function addHook(state, kind, name, hook) {
  var orig = hook;
  if (!state.registry[name]) {
    state.registry[name] = [];
  }

  if (kind === "before") {
    hook = function (method, options) {
      return Promise.resolve()
        .then(orig.bind(null, options))
        .then(method.bind(null, options));
    };
  }

  if (kind === "after") {
    hook = function (method, options) {
      var result;
      return Promise.resolve()
        .then(method.bind(null, options))
        .then(function (result_) {
          result = result_;
          return orig(result, options);
        })
        .then(function () {
          return result;
        });
    };
  }

  if (kind === "error") {
    hook = function (method, options) {
      return Promise.resolve()
        .then(method.bind(null, options))
        .catch(function (error) {
          return orig(error, options);
        });
    };
  }

  state.registry[name].push({
    hook: hook,
    orig: orig,
  });
}


/***/ }),

/***/ "./node_modules/before-after-hook/lib/register.js":
/*!********************************************************!*\
  !*** ./node_modules/before-after-hook/lib/register.js ***!
  \********************************************************/
/***/ ((module) => {

module.exports = register;

function register(state, name, method, options) {
  if (typeof method !== "function") {
    throw new Error("method for before hook must be a function");
  }

  if (!options) {
    options = {};
  }

  if (Array.isArray(name)) {
    return name.reverse().reduce(function (callback, name) {
      return register.bind(null, state, name, callback, options);
    }, method)();
  }

  return Promise.resolve().then(function () {
    if (!state.registry[name]) {
      return method(options);
    }

    return state.registry[name].reduce(function (method, registered) {
      return registered.hook.bind(null, method, options);
    }, method)();
  });
}


/***/ }),

/***/ "./node_modules/before-after-hook/lib/remove.js":
/*!******************************************************!*\
  !*** ./node_modules/before-after-hook/lib/remove.js ***!
  \******************************************************/
/***/ ((module) => {

module.exports = removeHook;

function removeHook(state, name, method) {
  if (!state.registry[name]) {
    return;
  }

  var index = state.registry[name]
    .map(function (registered) {
      return registered.orig;
    })
    .indexOf(method);

  if (index === -1) {
    return;
  }

  state.registry[name].splice(index, 1);
}


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./styles/animations/animations.css":
/*!********************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./styles/animations/animations.css ***!
  \********************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `@keyframes slideInFromLeft {
  0% {
    opacity: 0;
    transform: translateX(-100%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}`, "",{"version":3,"sources":["webpack://./styles/animations/animations.css"],"names":[],"mappings":"AAAA;EACE;IACE,UAAU;IACV,4BAA4B;EAC9B;EACA;IACE,UAAU;IACV,wBAAwB;EAC1B;AACF","sourcesContent":["@keyframes slideInFromLeft {\r\n  0% {\r\n    opacity: 0;\r\n    transform: translateX(-100%);\r\n  }\r\n  100% {\r\n    opacity: 1;\r\n    transform: translateX(0);\r\n  }\r\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./styles/defaults/core.css":
/*!************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./styles/defaults/core.css ***!
  \************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `:root {
    --primary: #231b40;
    --primary-2: #7a36d9;
    --secondary: #f29d35;
    --secondary-2: #efb978;
    --tertiary: #e7dcf2;
    --tertiary-2: #0c0915;
}

html {
    scroll-behavior: smooth;
}

.mobile-menu {
    display: none;
}

body {
    font-family: "Montserrat", sans-serif;
    color: var(--secondary);
    font-size: 1.25rem;
    line-height: 150%;
    margin: 0;
    font-variant: small-caps;
}

h1 {
    font-size: 6rem;
    font-weight: 700;
    margin: 0 0 .6em;
    font-variant: small-caps;
}

.subtitle {
    font-size: 1.4rem;
    font-weight: 500;
    margin: 0 0 1rem;
}

/* Navbar */

nav {
    font-size: 1.2em;
    position: fixed;
    top: -10px;
    left: -10px;
}

li {
    list-style-type: none;
    font-variant: small-caps;
    font-style: italic;
    font-weight: 400;
    margin-bottom: 7px;
}

nav a {
    transition: all 0.3s cubic-bezier(0.52, 0.17, 0, 0.99);
    position: relative;
    left: 0;
    display: flex;
    align-items: center;
}

nav .prefix {
    align-items: center;
    display: inline-flex;
    background: var(--tertiary);
    width: 40px;
    height: 2px;
    margin-right: 15px;
    transition: all 0.3s ease-in-out;
}

nav a:hover li {
    left: 15px;
}

nav a:hover .prefix {
    transition-duration: 100ms;
    width: 49px;
}

nav a {
    transition-duration: 100ms;
}

nav a.active {
    left: 15px;
}


a {
    text-decoration: none;
    color: var(--tertiary);
}
`, "",{"version":3,"sources":["webpack://./styles/defaults/core.css"],"names":[],"mappings":"AAAA;IACI,kBAAkB;IAClB,oBAAoB;IACpB,oBAAoB;IACpB,sBAAsB;IACtB,mBAAmB;IACnB,qBAAqB;AACzB;;AAEA;IACI,uBAAuB;AAC3B;;AAEA;IACI,aAAa;AACjB;;AAEA;IACI,qCAAqC;IACrC,uBAAuB;IACvB,kBAAkB;IAClB,iBAAiB;IACjB,SAAS;IACT,wBAAwB;AAC5B;;AAEA;IACI,eAAe;IACf,gBAAgB;IAChB,gBAAgB;IAChB,wBAAwB;AAC5B;;AAEA;IACI,iBAAiB;IACjB,gBAAgB;IAChB,gBAAgB;AACpB;;AAEA,WAAW;;AAEX;IACI,gBAAgB;IAChB,eAAe;IACf,UAAU;IACV,WAAW;AACf;;AAEA;IACI,qBAAqB;IACrB,wBAAwB;IACxB,kBAAkB;IAClB,gBAAgB;IAChB,kBAAkB;AACtB;;AAEA;IACI,sDAAsD;IACtD,kBAAkB;IAClB,OAAO;IACP,aAAa;IACb,mBAAmB;AACvB;;AAEA;IACI,mBAAmB;IACnB,oBAAoB;IACpB,2BAA2B;IAC3B,WAAW;IACX,WAAW;IACX,kBAAkB;IAClB,gCAAgC;AACpC;;AAEA;IACI,UAAU;AACd;;AAEA;IACI,0BAA0B;IAC1B,WAAW;AACf;;AAEA;IACI,0BAA0B;AAC9B;;AAEA;IACI,UAAU;AACd;;;AAGA;IACI,qBAAqB;IACrB,sBAAsB;AAC1B","sourcesContent":[":root {\r\n    --primary: #231b40;\r\n    --primary-2: #7a36d9;\r\n    --secondary: #f29d35;\r\n    --secondary-2: #efb978;\r\n    --tertiary: #e7dcf2;\r\n    --tertiary-2: #0c0915;\r\n}\r\n\r\nhtml {\r\n    scroll-behavior: smooth;\r\n}\r\n\r\n.mobile-menu {\r\n    display: none;\r\n}\r\n\r\nbody {\r\n    font-family: \"Montserrat\", sans-serif;\r\n    color: var(--secondary);\r\n    font-size: 1.25rem;\r\n    line-height: 150%;\r\n    margin: 0;\r\n    font-variant: small-caps;\r\n}\r\n\r\nh1 {\r\n    font-size: 6rem;\r\n    font-weight: 700;\r\n    margin: 0 0 .6em;\r\n    font-variant: small-caps;\r\n}\r\n\r\n.subtitle {\r\n    font-size: 1.4rem;\r\n    font-weight: 500;\r\n    margin: 0 0 1rem;\r\n}\r\n\r\n/* Navbar */\r\n\r\nnav {\r\n    font-size: 1.2em;\r\n    position: fixed;\r\n    top: -10px;\r\n    left: -10px;\r\n}\r\n\r\nli {\r\n    list-style-type: none;\r\n    font-variant: small-caps;\r\n    font-style: italic;\r\n    font-weight: 400;\r\n    margin-bottom: 7px;\r\n}\r\n\r\nnav a {\r\n    transition: all 0.3s cubic-bezier(0.52, 0.17, 0, 0.99);\r\n    position: relative;\r\n    left: 0;\r\n    display: flex;\r\n    align-items: center;\r\n}\r\n\r\nnav .prefix {\r\n    align-items: center;\r\n    display: inline-flex;\r\n    background: var(--tertiary);\r\n    width: 40px;\r\n    height: 2px;\r\n    margin-right: 15px;\r\n    transition: all 0.3s ease-in-out;\r\n}\r\n\r\nnav a:hover li {\r\n    left: 15px;\r\n}\r\n\r\nnav a:hover .prefix {\r\n    transition-duration: 100ms;\r\n    width: 49px;\r\n}\r\n\r\nnav a {\r\n    transition-duration: 100ms;\r\n}\r\n\r\nnav a.active {\r\n    left: 15px;\r\n}\r\n\r\n\r\na {\r\n    text-decoration: none;\r\n    color: var(--tertiary);\r\n}\r\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./styles/dynamic/projects.css":
/*!***************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./styles/dynamic/projects.css ***!
  \***************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `#project-nav-link {
    font-variant: small-caps;
}

#project-nav-link:hover {
    color: var(--secondary);
}

#projects-list a {
    position: relative;
    opacity: 0;
    transform: translateX(-100%);
}

#projects-list a.animate {
    animation: slideInFromLeft 1s cubic-bezier(0.52, 0.17, 0, 0.99) forwards;
}

#projects-list li {
    color: var(--primary);
    font-size: .85em;
    font-weight: 500;
}

/* Projects summary */

#projects-summary {
    margin: 4em 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(15rem, 2fr));
    justify-content: space-between;
    max-width: 80%;
    column-gap: 2em;
    row-gap: 2em;
}

#projects-summary .language {
    display: flex;
    flex-direction: column;
    background: var(--primary);
    padding: 1.1em;
    text-align: center;
    gap: 1.1rem;
    clip-path: polygon(10% 5%, 90% 5%, 95% 15%, 95% 85%, 90% 95%, 10% 95%, 5% 85%, 5% 15%);
}

#projects-summary .language-name {
    font-size: 2rem;
    font-weight: bold;
}

#projects-summary .language-share {
    font-size: 1.2em;
}`, "",{"version":3,"sources":["webpack://./styles/dynamic/projects.css"],"names":[],"mappings":"AAAA;IACI,wBAAwB;AAC5B;;AAEA;IACI,uBAAuB;AAC3B;;AAEA;IACI,kBAAkB;IAClB,UAAU;IACV,4BAA4B;AAChC;;AAEA;IACI,wEAAwE;AAC5E;;AAEA;IACI,qBAAqB;IACrB,gBAAgB;IAChB,gBAAgB;AACpB;;AAEA,qBAAqB;;AAErB;IACI,aAAa;IACb,aAAa;IACb,2DAA2D;IAC3D,8BAA8B;IAC9B,cAAc;IACd,eAAe;IACf,YAAY;AAChB;;AAEA;IACI,aAAa;IACb,sBAAsB;IACtB,0BAA0B;IAC1B,cAAc;IACd,kBAAkB;IAClB,WAAW;IACX,sFAAsF;AAC1F;;AAEA;IACI,eAAe;IACf,iBAAiB;AACrB;;AAEA;IACI,gBAAgB;AACpB","sourcesContent":["#project-nav-link {\r\n    font-variant: small-caps;\r\n}\r\n\r\n#project-nav-link:hover {\r\n    color: var(--secondary);\r\n}\r\n\r\n#projects-list a {\r\n    position: relative;\r\n    opacity: 0;\r\n    transform: translateX(-100%);\r\n}\r\n\r\n#projects-list a.animate {\r\n    animation: slideInFromLeft 1s cubic-bezier(0.52, 0.17, 0, 0.99) forwards;\r\n}\r\n\r\n#projects-list li {\r\n    color: var(--primary);\r\n    font-size: .85em;\r\n    font-weight: 500;\r\n}\r\n\r\n/* Projects summary */\r\n\r\n#projects-summary {\r\n    margin: 4em 0;\r\n    display: grid;\r\n    grid-template-columns: repeat(auto-fit, minmax(15rem, 2fr));\r\n    justify-content: space-between;\r\n    max-width: 80%;\r\n    column-gap: 2em;\r\n    row-gap: 2em;\r\n}\r\n\r\n#projects-summary .language {\r\n    display: flex;\r\n    flex-direction: column;\r\n    background: var(--primary);\r\n    padding: 1.1em;\r\n    text-align: center;\r\n    gap: 1.1rem;\r\n    clip-path: polygon(10% 5%, 90% 5%, 95% 15%, 95% 85%, 90% 95%, 10% 95%, 5% 85%, 5% 15%);\r\n}\r\n\r\n#projects-summary .language-name {\r\n    font-size: 2rem;\r\n    font-weight: bold;\r\n}\r\n\r\n#projects-summary .language-share {\r\n    font-size: 1.2em;\r\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./styles/style.css":
/*!****************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./styles/style.css ***!
  \****************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_animations_animations_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! -!../node_modules/css-loader/dist/cjs.js!./animations/animations.css */ "./node_modules/css-loader/dist/cjs.js!./styles/animations/animations.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_defaults_core_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! -!../node_modules/css-loader/dist/cjs.js!./defaults/core.css */ "./node_modules/css-loader/dist/cjs.js!./styles/defaults/core.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_dynamic_projects_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! -!../node_modules/css-loader/dist/cjs.js!./dynamic/projects.css */ "./node_modules/css-loader/dist/cjs.js!./styles/dynamic/projects.css");
// Imports





var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_animations_animations_css__WEBPACK_IMPORTED_MODULE_2__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_defaults_core_css__WEBPACK_IMPORTED_MODULE_3__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_dynamic_projects_css__WEBPACK_IMPORTED_MODULE_4__["default"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `:root {
  --primary: #231b40;
  --primary-2: #7a36d9;
  --secondary: #f29d35;
  --secondary-2: #efb978;
  --tertiary: #e7dcf2;
  --tertiary-2: #0c0915;
}

.container {
  min-height: 100vh;
}

#intro-wrapper section {
  padding-top: 30em;
  padding-left: 15em;
}

.container section {
  padding-top: 8em;
  padding-left: 15em;
}

.container.lighter {
  background-color: var(--tertiary);
}

.container.lighter h1 {
  color: var(--primary); 
}

.container.lighter h5 {
  color: var(--tertiary-2);
}

.container.darker {
  background-color: var(--tertiary-2);
}

@media screen and (max-width: 1440px) {
  #intro-wrapper section {
    padding-top: 23em;
    padding-left: 15em;
  }

  .container section {
      padding-top: 6em;
      padding-left: 15em;
  }
}

@media screen and (max-width: 768px) {
  .mobile-menu {
    display: block;
    position: fixed;
    top: 0;
    right: 0;
    margin: 0;
    padding: 0;
    z-index: 100;
    background-color: var(--tertiary-2);
    width: 100%;
    height: 100%;
    overflow-y: auto;
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.52, 0.17, 0, 0.99);
  }

  .hamburger {
    display: block;
    position: fixed;
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    cursor: pointer;
    background-color: red;
  }

  .mobile-menu .menu-items {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .mobile-menu .close-hamburger-wrapper {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    cursor: pointer;
    background-color: green;
  }

  .mobile-menu.open {
    transform: translateX(0);
  }

  .mobile-menu ul {
    padding: 0;
    width: 100%;
  }

  .mobile-menu li {
    list-style: none;
    margin: .5rem 0;
    padding: 1.2rem 0;
    text-align: center;
    transition-duration: 300ms;
  }

  .mobile-menu .menu-items a:hover li {
    background-color: var(--tertiary);
  }


  nav {
    display: none;
  }

  .mobile-menu .hide {
    display: none;
  }

  .container section {
    /* padding: 11em 5em; */
  }
}`, "",{"version":3,"sources":["webpack://./styles/style.css"],"names":[],"mappings":"AAIA;EACE,kBAAkB;EAClB,oBAAoB;EACpB,oBAAoB;EACpB,sBAAsB;EACtB,mBAAmB;EACnB,qBAAqB;AACvB;;AAEA;EACE,iBAAiB;AACnB;;AAEA;EACE,iBAAiB;EACjB,kBAAkB;AACpB;;AAEA;EACE,gBAAgB;EAChB,kBAAkB;AACpB;;AAEA;EACE,iCAAiC;AACnC;;AAEA;EACE,qBAAqB;AACvB;;AAEA;EACE,wBAAwB;AAC1B;;AAEA;EACE,mCAAmC;AACrC;;AAEA;EACE;IACE,iBAAiB;IACjB,kBAAkB;EACpB;;EAEA;MACI,gBAAgB;MAChB,kBAAkB;EACtB;AACF;;AAEA;EACE;IACE,cAAc;IACd,eAAe;IACf,MAAM;IACN,QAAQ;IACR,SAAS;IACT,UAAU;IACV,YAAY;IACZ,mCAAmC;IACnC,WAAW;IACX,YAAY;IACZ,gBAAgB;IAChB,4BAA4B;IAC5B,4DAA4D;EAC9D;;EAEA;IACE,cAAc;IACd,eAAe;IACf,SAAS;IACT,WAAW;IACX,WAAW;IACX,YAAY;IACZ,eAAe;IACf,qBAAqB;EACvB;;EAEA;IACE,aAAa;IACb,sBAAsB;IACtB,mBAAmB;IACnB,uBAAuB;IACvB,YAAY;EACd;;EAEA;IACE,kBAAkB;IAClB,SAAS;IACT,WAAW;IACX,WAAW;IACX,YAAY;IACZ,eAAe;IACf,uBAAuB;EACzB;;EAEA;IACE,wBAAwB;EAC1B;;EAEA;IACE,UAAU;IACV,WAAW;EACb;;EAEA;IACE,gBAAgB;IAChB,eAAe;IACf,iBAAiB;IACjB,kBAAkB;IAClB,0BAA0B;EAC5B;;EAEA;IACE,iCAAiC;EACnC;;;EAGA;IACE,aAAa;EACf;;EAEA;IACE,aAAa;EACf;;EAEA;IACE,uBAAuB;EACzB;AACF","sourcesContent":["@import url(\"animations/animations.css\");\r\n@import url(\"defaults/core.css\");\r\n@import url(\"dynamic/projects.css\");\r\n\r\n:root {\r\n  --primary: #231b40;\r\n  --primary-2: #7a36d9;\r\n  --secondary: #f29d35;\r\n  --secondary-2: #efb978;\r\n  --tertiary: #e7dcf2;\r\n  --tertiary-2: #0c0915;\r\n}\r\n\r\n.container {\r\n  min-height: 100vh;\r\n}\r\n\r\n#intro-wrapper section {\r\n  padding-top: 30em;\r\n  padding-left: 15em;\r\n}\r\n\r\n.container section {\r\n  padding-top: 8em;\r\n  padding-left: 15em;\r\n}\r\n\r\n.container.lighter {\r\n  background-color: var(--tertiary);\r\n}\r\n\r\n.container.lighter h1 {\r\n  color: var(--primary); \r\n}\r\n\r\n.container.lighter h5 {\r\n  color: var(--tertiary-2);\r\n}\r\n\r\n.container.darker {\r\n  background-color: var(--tertiary-2);\r\n}\r\n\r\n@media screen and (max-width: 1440px) {\r\n  #intro-wrapper section {\r\n    padding-top: 23em;\r\n    padding-left: 15em;\r\n  }\r\n\r\n  .container section {\r\n      padding-top: 6em;\r\n      padding-left: 15em;\r\n  }\r\n}\r\n\r\n@media screen and (max-width: 768px) {\r\n  .mobile-menu {\r\n    display: block;\r\n    position: fixed;\r\n    top: 0;\r\n    right: 0;\r\n    margin: 0;\r\n    padding: 0;\r\n    z-index: 100;\r\n    background-color: var(--tertiary-2);\r\n    width: 100%;\r\n    height: 100%;\r\n    overflow-y: auto;\r\n    transform: translateX(-100%);\r\n    transition: transform 0.3s cubic-bezier(0.52, 0.17, 0, 0.99);\r\n  }\r\n\r\n  .hamburger {\r\n    display: block;\r\n    position: fixed;\r\n    top: 20px;\r\n    right: 20px;\r\n    width: 40px;\r\n    height: 40px;\r\n    cursor: pointer;\r\n    background-color: red;\r\n  }\r\n\r\n  .mobile-menu .menu-items {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: center;\r\n    height: 100%;\r\n  }\r\n\r\n  .mobile-menu .close-hamburger-wrapper {\r\n    position: absolute;\r\n    top: 20px;\r\n    right: 20px;\r\n    width: 40px;\r\n    height: 40px;\r\n    cursor: pointer;\r\n    background-color: green;\r\n  }\r\n\r\n  .mobile-menu.open {\r\n    transform: translateX(0);\r\n  }\r\n\r\n  .mobile-menu ul {\r\n    padding: 0;\r\n    width: 100%;\r\n  }\r\n\r\n  .mobile-menu li {\r\n    list-style: none;\r\n    margin: .5rem 0;\r\n    padding: 1.2rem 0;\r\n    text-align: center;\r\n    transition-duration: 300ms;\r\n  }\r\n\r\n  .mobile-menu .menu-items a:hover li {\r\n    background-color: var(--tertiary);\r\n  }\r\n\r\n\r\n  nav {\r\n    display: none;\r\n  }\r\n\r\n  .mobile-menu .hide {\r\n    display: none;\r\n  }\r\n\r\n  .container section {\r\n    /* padding: 11em 5em; */\r\n  }\r\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {

"use strict";


module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./node_modules/deprecation/dist-web/index.js":
/*!****************************************************!*\
  !*** ./node_modules/deprecation/dist-web/index.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Deprecation: () => (/* binding */ Deprecation)
/* harmony export */ });
class Deprecation extends Error {
  constructor(message) {
    super(message); // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = 'Deprecation';
  }

}




/***/ }),

/***/ "./node_modules/once/once.js":
/*!***********************************!*\
  !*** ./node_modules/once/once.js ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var wrappy = __webpack_require__(/*! wrappy */ "./node_modules/wrappy/wrappy.js")
module.exports = wrappy(once)
module.exports.strict = wrappy(onceStrict)

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  })
})

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  f.called = false
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  var name = fn.name || 'Function wrapped with `once`'
  f.onceError = name + " shouldn't be called more than once"
  f.called = false
  return f
}


/***/ }),

/***/ "./styles/style.css":
/*!**************************!*\
  !*** ./styles/style.css ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./style.css */ "./node_modules/css-loader/dist/cjs.js!./styles/style.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {

"use strict";


var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {

"use strict";


var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),

/***/ "./scripts/api/ReposReader.ts":
/*!************************************!*\
  !*** ./scripts/api/ReposReader.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _octokit_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @octokit/core */ "./node_modules/@octokit/core/dist-web/index.js");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};

var Reader = /** @class */ (function () {
    function Reader() {
    }
    Reader.prototype.getData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, cachedData, octokit, headers, lastModified_1, response, lastModified, data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        cacheKey = "reposListCache";
                        cachedData = localStorage.getItem(cacheKey);
                        octokit = new _octokit_core__WEBPACK_IMPORTED_MODULE_0__.Octokit({ auth: "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" });
                        headers = {};
                        if (cachedData) {
                            lastModified_1 = JSON.parse(cachedData).lastModified;
                            headers = {
                                "If-Modified-Since": lastModified_1,
                                "X-GitHub-Api-Version": "2022-11-28"
                            };
                        }
                        return [4 /*yield*/, octokit.request("GET /user/repos", headers)];
                    case 1:
                        response = _a.sent();
                        if (Number(response.status) === 304) {
                            return [2 /*return*/, JSON.parse(cachedData).data];
                        }
                        lastModified = response.headers["last-modified"];
                        data = response.data;
                        localStorage.setItem(cacheKey, JSON.stringify({ lastModified: lastModified, data: data }));
                        return [2 /*return*/, data];
                    case 2:
                        error_1 = _a.sent();
                        console.error(error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return Reader;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Reader);


/***/ }),

/***/ "./scripts/core/pageBuilder.ts":
/*!*************************************!*\
  !*** ./scripts/core/pageBuilder.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _api_ReposReader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../api/ReposReader */ "./scripts/api/ReposReader.ts");
/* harmony import */ var _projects_projectBuilder__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../projects/projectBuilder */ "./scripts/projects/projectBuilder.ts");


var Builder = /** @class */ (function () {
    function Builder() {
        this.containerWrappers = document.querySelectorAll('main > div');
        this.containers = document.querySelectorAll('section');
        this.navigationBarItems = document.querySelectorAll('nav ul a');
        this.hamburgerMenuButton = document.querySelector('.hamburger');
        this.hamburgerMenuItems = document.querySelector('.mobile-menu .menu-items');
        this.closeHamburgerMenu = document.querySelector('.close-hamburger-wrapper');
        this.mobileMenu = document.querySelector('.mobile-menu');
        this.projectsNavigation = document.querySelector('#projects-navigation');
        this.projectsSection = document.querySelector('.projects-container');
        this.reposReader = new _api_ReposReader__WEBPACK_IMPORTED_MODULE_0__["default"]();
        this.projectBuilder = new _projects_projectBuilder__WEBPACK_IMPORTED_MODULE_1__["default"](this.reposReader);
    }
    Builder.prototype.build = function () {
        this.setupEvents();
        this.calculateAge();
        this.buildSections();
        this.buildProjectSummary();
    };
    Builder.prototype.buildProjectSummary = function () {
        var _this = this;
        this.projectBuilder.getLanguages().then(function (data) {
            var summary = document.createElement('div');
            summary.id = 'projects-summary';
            var languages = Object.keys(data);
            var shares = Object.values(data);
            languages.forEach(function (language, index) {
                var languageElement = document.createElement('a');
                languageElement.classList.add('language');
                var languageName = document.createElement('span');
                languageName.classList.add('language-name');
                languageName["textContent"] = language;
                var languageShare = document.createElement('span');
                languageShare.classList.add('language-share');
                languageShare.textContent = data[language].amount;
                languageElement.appendChild(languageName);
                languageElement.appendChild(languageShare);
                languageElement.href = "#" + data[language].linkToNext;
                summary.appendChild(languageElement);
            });
            _this.projectsSection.appendChild(summary);
        });
    };
    Builder.prototype.updateNavbar = function (current) {
        this.navigationBarItems.forEach(function (link) {
            var href = link.getAttribute("href");
            link.classList.toggle("active", href && href.includes(current));
        });
    };
    Builder.prototype.setupEvents = function () {
        var _this = this;
        var _a;
        window.addEventListener("scroll", function () {
            var current = _this.getCurrentSection();
            _this.updateNavbar(current);
        });
        if (this.hamburgerMenuButton) {
            this.hamburgerMenuButton.addEventListener("click", function () {
                var _a;
                (_a = _this.mobileMenu) === null || _a === void 0 ? void 0 : _a.classList.add("open");
            });
        }
        if (this.closeHamburgerMenu) {
            this.closeHamburgerMenu.addEventListener("click", function () {
                var _a;
                (_a = _this.mobileMenu) === null || _a === void 0 ? void 0 : _a.classList.remove("open");
            });
        }
        (_a = this.projectsNavigation) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
            if (!document.querySelector('#projects-list')) {
                setTimeout(function () {
                    _this.buildProjectsNavigation();
                }, 200);
            }
        });
    };
    Builder.prototype.buildSections = function () {
        var _this = this;
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var isLighter = entry.target.classList.contains("lighter");
                    _this.updateNavbarColor(isLighter ? "var(--primary)" : "var(--tertiary)", isLighter ? "var(--primary)" : "var(--tertiary)");
                    if (entry.target.classList.contains("projects-container")) {
                        _this.buildProjectsNavigation();
                    }
                    else {
                        var projectsList = document.querySelector("#projects-list");
                        projectsList === null || projectsList === void 0 ? void 0 : projectsList.remove();
                    }
                }
            });
        }, { threshold: 0.8 });
        this.containerWrappers.forEach(function (div) {
            observer.observe(div);
        });
    };
    Builder.prototype.updateNavbarColor = function (textColor, backgroundColor) {
        this.navigationBarItems.forEach(function (element) {
            element.style.setProperty("color", textColor);
            var firstChild = element.children[0];
            firstChild === null || firstChild === void 0 ? void 0 : firstChild.style.setProperty("background", backgroundColor);
        });
    };
    Builder.prototype.calculateAge = function () {
        var today = new Date();
        var birthDate = new Date("2001-03-29");
        var ageContainer = document.querySelector("#age");
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        if (ageContainer) {
            ageContainer.innerHTML = age.toString();
        }
    };
    Builder.prototype.buildProjectsNavigation = function () {
        var _this = this;
        if (window.innerWidth < 768) {
            this.mobileMenu.querySelector('a[href="#projects-wrapper"]').addEventListener('click', function () {
            });
        }
        setTimeout(function () {
            var projectsList = document.createElement("ul");
            projectsList.id = "projects-list";
            _this.reposReader.getData().then(function (repo) {
                repo.forEach(function (repo, index) {
                    var project = document.createElement("a");
                    project.href = "#".concat(repo.name.toLowerCase());
                    var projectName = document.createElement("li");
                    projectName.textContent = repo.name;
                    project.appendChild(projectName);
                    // Set initial position of project element
                    // Append project element to projectsList
                    projectsList.appendChild(project);
                    setTimeout(function () {
                        project.classList.toggle("animate");
                    }, index * 20);
                });
            });
            _this.navigationBarItems[1].insertAdjacentElement("afterend", projectsList);
        }, 200);
    };
    Builder.prototype.getCurrentSection = function () {
        var current = "";
        this.containerWrappers.forEach(function (section) {
            var sectionTop = section.offsetTop;
            var sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - sectionHeight / 3) {
                current = section.getAttribute("id") || "";
            }
        });
        return current;
    };
    return Builder;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Builder);


/***/ }),

/***/ "./scripts/projects/projectBuilder.ts":
/*!********************************************!*\
  !*** ./scripts/projects/projectBuilder.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ProjectsPageBuilder: () => (/* binding */ ProjectsPageBuilder),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var ProjectBuilder = /** @class */ (function () {
    function ProjectBuilder(reader) {
        this.shares = {};
        this.reader = reader;
    }
    ProjectBuilder.prototype.getLanguages = function () {
        return __awaiter(this, void 0, void 0, function () {
            var repos, allLanguages, uniqueLanguages;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.reader.getData()];
                    case 1:
                        repos = _a.sent();
                        allLanguages = repos.map(function (repo) { return repo.language; });
                        uniqueLanguages = new Set(allLanguages);
                        uniqueLanguages.forEach(function (language) {
                            _this.shares[language] = {
                                amount: allLanguages.filter(function (l) { return l === language; }).length,
                                linkToNext: repos.find(function (repo) { return repo.language === language; })["language"]
                            };
                        });
                        console.log(this.shares);
                        return [2 /*return*/, this.shares];
                }
            });
        });
    };
    return ProjectBuilder;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ProjectBuilder);
var ProjectsPageBuilder = /** @class */ (function () {
    function ProjectsPageBuilder() {
    }
    return ProjectsPageBuilder;
}());



/***/ }),

/***/ "./node_modules/universal-user-agent/dist-web/index.js":
/*!*************************************************************!*\
  !*** ./node_modules/universal-user-agent/dist-web/index.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getUserAgent: () => (/* binding */ getUserAgent)
/* harmony export */ });
function getUserAgent() {
    if (typeof navigator === "object" && "userAgent" in navigator) {
        return navigator.userAgent;
    }
    if (typeof process === "object" && process.version !== undefined) {
        return `Node.js/${process.version.substr(1)} (${process.platform}; ${process.arch})`;
    }
    return "<environment undetectable>";
}


//# sourceMappingURL=index.js.map


/***/ }),

/***/ "./node_modules/wrappy/wrappy.js":
/*!***************************************!*\
  !*** ./node_modules/wrappy/wrappy.js ***!
  \***************************************/
/***/ ((module) => {

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
module.exports = wrappy
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k]
  })

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    var ret = fn.apply(this, args)
    var cb = args[args.length-1]
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k]
      })
    }
    return ret
  }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*************************!*\
  !*** ./scripts/main.ts ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _styles_style_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../styles/style.css */ "./styles/style.css");
/* harmony import */ var _core_pageBuilder__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./core/pageBuilder */ "./scripts/core/pageBuilder.ts");


var Main = /** @class */ (function () {
    function Main() {
        new _core_pageBuilder__WEBPACK_IMPORTED_MODULE_1__["default"]().build();
    }
    return Main;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Main);
var main = new Main();

})();

/******/ })()
;
//# sourceMappingURL=maps/brain.js.map