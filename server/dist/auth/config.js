"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.local = exports.authConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.authConfig = {
    strategy: "local",
    secret: process.env.AUTH_SECRET,
    expiryTime: "1h",
    algorithm: "HS256",
};
exports.local = {
    strategyName: "local",
};
//# sourceMappingURL=config.js.map