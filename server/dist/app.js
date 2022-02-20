"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_errors_1 = __importDefault(require("http-errors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const routes_1 = __importDefault(require("./routes"));
const users_1 = __importDefault(require("./routes/users"));
const auth_1 = __importDefault(require("./routes/auth"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const passport_1 = __importDefault(require("passport"));
const auth_2 = __importDefault(require("./auth/auth"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, helmet_1.default)()); // https://expressjs.com/en/advanced/best-practice-security.html#use-helmet
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(passport_1.default.initialize());
passport_1.default.use(auth_2.default);
app.use('/', routes_1.default);
app.use('/users', users_1.default);
app.use('/auth', auth_1.default);
// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(new http_errors_1.default.NotFound());
});
// pass any unhandled errors to the error handler
app.use(errorHandler_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map