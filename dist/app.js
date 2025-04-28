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
const zod_1 = require("zod");
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const middleware_1 = require("./middleware");
const PORT = 3009;
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const signupSchema = zod_1.z.object({
    username: zod_1.z.string().min(1, { message: 'Username is required' }).max(20, { message: 'Username is too long' }),
    password: zod_1.z.string().min(8, { message: 'Password must be at least 8 characters' })
});
app.post('/api/v1/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = signupSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({ message: result.error.errors.map(e => e.message).join(', ') });
            return;
        }
        const { username, password } = req.body;
        const existingUser = yield prisma.user.findUnique({
            where: { username }
        });
        if (existingUser) {
            res.status(400).json({ message: 'Username already exists' });
            return;
        }
        // Create the new user in the database
        yield prisma.user.create({
            data: { username, password }
        });
        res.status(201).json({ message: 'User created successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
app.post('/api/v1/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({ message: 'Username and password are required' });
            return;
        }
        const findUser = yield prisma.user.findUnique({
            where: { username }
        });
        if (!findUser) {
            res.status(400).json({ message: 'User not found' });
            return;
        }
        if (findUser.password !== password) {
            res.status(400).json({ message: 'Incorrect password' });
            return;
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: findUser.id }, config_1.JWT_TOKEN);
        res.status(200).json({ message: 'Login successful', token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
app.post('/api/v1/content', middleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { link, type, title } = req.body;
        // @ts-ignore
        const authorization = req.userId;
        const response = yield prisma.content.create({
            data: {
                title,
                link,
                type,
                user: {
                    connect: { id: authorization }
                }
            }
        });
        console.log(response);
        res.status(201).json({ message: 'Content created successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
app.get('/api/v1/getcontent', (req, res) => {
});
app.delete('/api/v1/deletecontent', (req, res) => {
});
app.get('/', (req, res) => {
    res.send('Hello World');
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
