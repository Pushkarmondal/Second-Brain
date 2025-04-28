"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const middleware = (req, res, next) => {
    const header = req.headers['authorization'];
    if (!header) {
        res.status(401).json({ message: 'Authorization header missing' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(header, config_1.JWT_TOKEN);
        if (typeof decoded === 'string') {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        req.userId = decoded.id;
        next();
    }
    catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};
exports.middleware = middleware;
