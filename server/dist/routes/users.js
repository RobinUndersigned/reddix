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
const router = express_1.default.Router();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield PrismaClient_1.default.user.findMany();
        res.send(users);
    }
    catch (err) {
        console.log(err);
    }
}));
router.get("/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.userId, 10);
    try {
        console.log(req.params);
        const user = yield PrismaClient_1.default.user.findUnique({
            where: {
                id,
            },
        });
        console.log(user);
        res.send(user);
    }
    catch (err) {
        console.log(err);
    }
    res.send({ working: true });
}));
exports.default = router;
//# sourceMappingURL=users.js.map