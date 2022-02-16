"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res) => {
    // eslint-disable-next-line no-console
    console.error(err);
    // if the error is safe to expose to client
    if (err.expose === true) {
        res.status(err.status || 500).send(err);
    }
    else {
        res.status(500).send(new http_errors_1.default.InternalServerError());
    }
};
exports.default = errorHandler;
//# sourceMappingURL=errorHandler.js.map