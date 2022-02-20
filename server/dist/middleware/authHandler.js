"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_jwt_1 = __importDefault(require("express-jwt"));
const express_jwt_2 = require("express-jwt");
const http_errors_1 = require("http-errors");
const config_1 = require("../auth/config");
const user_1 = require("../auth/user");
/**
 * Extracts the auth token from the request authorization header and returns it.
 * @param request The auth token or null if it doesn't exist in the request
 */
function getAuthTokenFromHeader(request) {
    if (!request.headers.authorization)
        return null;
    const authHeader = request.headers.authorization.split(" ");
    if (authHeader.length === 2 && authHeader[0] === "Bearer") {
        return authHeader[1];
    }
    return null;
}
const jwtMiddleware = (0, express_jwt_1.default)({
    secret: config_1.authConfig.secret,
    userProperty: "user",
    getToken: getAuthTokenFromHeader,
    algorithms: ["HS256"],
});
/**
 * Converts authorization errors to 401 - Unauthorized, uses pass-through for other errors
 * @param error The error that occurred during authorization
 * @param req The express request
 * @param res The express response
 * @param next The next middleware
 */
function authErrorHandler(error, req, res, next) {
    next(error instanceof express_jwt_2.UnauthorizedError ? new http_errors_1.Unauthorized(error.message) : error);
}
/**
 * Checks if the current user is an admin and throws a 403 - Forbidden if they are not
 * @param req The express request
 * @param res The express response
 * @param next The next middleware
 */
function adminOnlyMiddleware(req, res, next) {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== user_1.Role.ADMIN)
        return next(new http_errors_1.Forbidden("admin role required"));
    else
        return next();
}
/**
 * An authorization middleware. Checks if the authorization header contains a valid auth token and
 * if the user has the permissions necessary to access the protected resource.
 * @param adminOnly Boolean flag to only allow admins to access the protected resource
 */
function authHandler(adminOnly = false) {
    const middleware = [jwtMiddleware, authErrorHandler];
    if (adminOnly)
        middleware.splice(1, 0, adminOnlyMiddleware);
    return middleware;
}
exports.default = authHandler;
//# sourceMappingURL=authHandler.js.map