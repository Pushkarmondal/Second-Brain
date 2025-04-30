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
const links_1 = require("./links");
const PORT = 3009;
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const cors_1 = __importDefault(require("cors"));
app.use((0, cors_1.default)());
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
app.get('/api/v1/getcontent', middleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const userId = req.userId;
        const content = yield prisma.content.findMany({
            where: { userId },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            }
        });
        if (content.length === 0) {
            res.status(404).json({ message: 'No content found' });
            return;
        }
        res.status(200).json({ content });
        console.log(content);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
app.delete('/api/v1/deletecontent', middleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const authorization = req.userId;
        const contentId = req.body.contentId; // spelling fixed
        const deletedContent = yield prisma.content.deleteMany({
            where: {
                id: contentId,
                user: {
                    id: authorization
                }
            }
        });
        console.log(deletedContent);
        if (deletedContent.count === 0) {
            res.status(404).json({ message: 'Content not found or unauthorized' });
            return;
        }
        res.status(200).json({ message: 'Content deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
app.post("/api/v1/share", middleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { share } = req.body;
        // @ts-ignore
        const authorization = req.userId;
        if (share) {
            const linkShare = yield prisma.link.create({
                data: {
                    user: { connect: { id: authorization } },
                    hash: (0, links_1.generateRandomHash)(20)
                }
            });
            // console.log(linkShare);
            res.status(201).json({ message: 'Link created successfully', link: linkShare });
        }
        else {
            yield prisma.link.delete({
                where: {
                    userId: authorization
                }
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
app.get("/api/v1/:shareLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hash = req.params.shareLink;
        const link = yield prisma.link.findUnique({
            where: {
                hash
            }
        });
        if (!link) {
            res.status(411).json({
                message: 'Link not found'
            });
            return;
        }
        const content = yield prisma.content.findMany({
            where: {
                userId: link.userId
            },
            include: {
                user: {
                    select: {
                        id: false,
                        username: true
                    }
                }
            }
        });
        if (!content) {
            res.status(411).json({
                message: 'No content found'
            });
            return;
        }
        const user = yield prisma.user.findUnique({
            where: {
                id: link.userId,
            }
        });
        if (!user) {
            res.status(411).json({
                message: "No user Found with this link"
            });
        }
        res.status(200).json({
            message: 'Link found',
            content
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
app.get('/', (req, res) => {
    res.send('Hello World');
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
