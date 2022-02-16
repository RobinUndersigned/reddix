"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
describe('app', () => {
    it('should export the express app correctly', () => {
        expect(app_1.default).toBeTruthy();
    });
    describe('GET /', () => {
        it('should respond to the GET method with 200', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default).get('/');
            expect(response.statusCode).toBe(200);
        }));
    });
    describe('GET /404', () => {
        beforeEach(() => {
            // Avoid polluting the test output with 404 error messages
            jest.spyOn(console, 'error').mockImplementation();
        });
        it('should respond to the GET method with a 404 for a route that does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default).get('/404');
            expect(response.statusCode).toBe(404);
            expect(response.text).toBe('{"message":"Not Found"}');
        }));
        it('should respond to the POST method with a 404 for a route that does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default).post('/404');
            expect(response.statusCode).toBe(404);
            expect(response.text).toBe('{"message":"Not Found"}');
        }));
    });
});
//# sourceMappingURL=app.test.js.map