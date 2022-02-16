"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asyncMiddleware = (fn) => {
    return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
};
module.exports = asyncMiddleware;
//# sourceMappingURL=asyncHandler.js.map