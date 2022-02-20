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
const express_1 = __importDefault(require("express"));
const PrismaClient_1 = __importDefault(require("../db/PrismaClient"));
const superstruct_1 = require("superstruct");
const isemail_1 = __importDefault(require("isemail"));
const router = express_1.default.Router();
// Runtime validation
const Signup = (0, superstruct_1.object)({
    // string and a valid email address
    email: (0, superstruct_1.refine)((0, superstruct_1.string)(), 'email', (v) => isemail_1.default.validate(v)),
    // password is between 7 and 30 characters long
    password: (0, superstruct_1.size)((0, superstruct_1.string)(), 7, 30),
    // first name is between 2 and 50 characters long
    firstName: (0, superstruct_1.size)((0, superstruct_1.string)(), 2, 50),
    // last name is between 2 and 50 characters long
    lastName: (0, superstruct_1.size)((0, superstruct_1.string)(), 2, 50),
});
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, superstruct_1.assert)(req.body, Signup);
        const userData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: "Test123!"
        };
        const newUser = yield PrismaClient_1.default.user.create({
            data: userData
        });
        res.send({ id: newUser.id });
    }
    catch (err) {
        console.log(err);
        const { key, value, type } = err;
        if (value === undefined) {
            res.status(400).send(`${key} required`);
        }
        else if (type === 'never') {
            res.status(400).send(`User attribute unknown`);
        }
        else {
            res.status(400).send(`${key} invalid`);
        }
    }
}));
exports.default = router;
//# sourceMappingURL=auth.js.map