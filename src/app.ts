import { z } from 'zod';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { JWT_TOKEN } from './config';
import { middleware } from './middleware';
const PORT = 3009;
const prisma = new PrismaClient();
const app = express();
app.use(express.json());


const signupSchema = z.object({
      username: z.string().min(1, { message: 'Username is required' }).max(20, { message: 'Username is too long' }),
      password: z.string().min(8, { message: 'Password must be at least 8 characters' })
});

app.post('/api/v1/signup', async (req, res) => {
      try {
            const result = signupSchema.safeParse(req.body);

            if (!result.success) {
                  res.status(400).json({ message: result.error.errors.map(e => e.message).join(', ') });
                  return;
            }
            const { username, password } = req.body;
            const existingUser = await prisma.user.findUnique({
                  where: { username }
            });
            if (existingUser) {
                  res.status(400).json({ message: 'Username already exists' });
                  return;
            }

            // Create the new user in the database
            await prisma.user.create({
                  data: { username, password }
            });

            res.status(201).json({ message: 'User created successfully' });

      } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
      }
});

app.post('/api/v1/login', async(req, res) => { 
      try {
            const { username, password } = req.body;
            if (!username || !password) {
                  res.status(400).json({ message: 'Username and password are required' });
                  return;
            }
            const findUser = await prisma.user.findUnique({
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
            const token = jwt.sign({ id: findUser.id }, JWT_TOKEN);
            res.status(200).json({ message: 'Login successful', token });
      } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
       }
})

app.post('/api/v1/content', middleware, async (req, res) => {
      try {
            const { link, type, title } = req.body;
            // @ts-ignore
            const authorization = req.userId;
            const response = await prisma.content.create({
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
      } catch (error) { 
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
      }
})

app.get('/api/v1/getcontent', (req, res) => {
      
})

app.delete('/api/v1/deletecontent', (req, res) => { 

})

app.get('/', (req, res) => { 
      res.send('Hello World');
})

app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
})