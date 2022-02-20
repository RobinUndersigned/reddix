"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAuthToken = exports.Role = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("./config");
var Role;
(function (Role) {
    Role[Role["USER"] = 0] = "USER";
    Role[Role["ADMIN"] = 1] = "ADMIN";
})(Role = exports.Role || (exports.Role = {}));
function generateAuthToken(user) {
    const payload = user;
    const options = {
        expiresIn: config_1.authConfig.expiryTime,
        algorithm: "HS256",
        issuer: process.env.API_HOST,
        audience: process.env.API_HOST,
        subject: user.id,
    };
    return (0, jsonwebtoken_1.sign)(payload, config_1.authConfig.secret, options);
}
exports.generateAuthToken = generateAuthToken;
//# sourceMappingURL=user.js.map