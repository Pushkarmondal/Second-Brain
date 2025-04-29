"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomHash = generateRandomHash;
const node_crypto_1 = __importDefault(require("node:crypto"));
function generateRandomHash(length = 10) {
    return node_crypto_1.default.randomBytes(length).toString('hex').slice(0, length);
}
