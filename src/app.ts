import { z } from 'zod';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { JWT_TOKEN } from './config';
import { middleware } from './middleware';
import { generateRandomHash } from './links';
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

app.get('/api/v1/getcontent', middleware, async (req, res) => {
      try {
            // @ts-ignore
            const userId = req.userId;
            const content = await prisma.content.findMany({
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
                  return
            }
            res.status(200).json({ content });
            console.log(content);

      } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
      }
});


app.delete('/api/v1/deletecontent', middleware, async (req, res) => {
      try {
            // @ts-ignore
            const authorization = req.userId;
            const contentId = req.body.contentId;  // spelling fixed

            const deletedContent = await prisma.content.deleteMany({
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
      } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
      }
});

app.post("/api/v1/share", middleware, async (req, res) => {
      try {
            const { share } = req.body;
            // @ts-ignore
            const authorization = req.userId;
            if (share) {
                  const linkShare = await prisma.link.create({
                        data: {
                              user: { connect: { id: authorization } },
                              hash: generateRandomHash(20)
                        }
                  })
                  // console.log(linkShare);
                  res.status(201).json({ message: 'Link created successfully', link: linkShare });
            } else {
                  await prisma.link.delete({
                        where: {
                              userId: authorization
                        }
                  })
            }
      } catch (error) { 
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
      }
})

app.get("/api/v1/:shareLink", async (req, res) => { 
      try {
            const hash = req.params.shareLink;
            const link = await prisma.link.findUnique({
                  where: {
                        hash
                  }
            }) 
            if (!link) {
                  res.status(411).json({
                        message: 'Link not found'
                  })
                  return;
            }
            const content = await prisma.content.findMany({
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
            })
            if (!content) {
                  res.status(411).json({
                        message: 'No content found'
                  })
                  return;
            }

            const user = await prisma.user.findUnique({
                  where: {
                        id: link.userId,
                  }
            })
            if (!user) {
                  res.status(411).json({
                        message: "No user Found with this link"
                  })
            }
            res.status(200).json({
                  message: 'Link found',
                  content
            })

      } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
      }
})

app.get('/', (req, res) => { 
      res.send('Hello World');
})

app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
})