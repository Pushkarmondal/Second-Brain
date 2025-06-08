# Second Brain Backend

A RESTful API backend for a personal knowledge management system built with Node.js, Express, TypeScript, and Prisma ORM. This application allows users to save, organize, and share their digital content like links, documents, and notes.

## Features

- **User Authentication**: Secure signup/login with JWT tokens
- **Content Management**: Create, read, and delete personal content
- **Content Sharing**: Generate shareable links for your content collections
- **Type Safety**: Built with TypeScript for better code reliability
- **Database Integration**: PostgreSQL with Prisma ORM for type-safe database operations

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod
- **CORS**: Enabled for cross-origin requests

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd second-brain-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/second_brain"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev
   ```

5. **Start the server**
   ```bash
   npm run dev
   ```

The server will start on port 3009.

## API Endpoints

### Authentication

#### POST `/api/v1/signup`
Create a new user account.

**Request Body:**
```json
{
  "username": "string (1-20 characters)",
  "password": "string (min 8 characters)"
}
```

**Response:**
```json
{
  "message": "User created successfully"
}
```

#### POST `/api/v1/login`
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here"
}
```

### Content Management

#### POST `/api/v1/content`
Create new content (requires authentication).

**Headers:**
```
Authorization: your_jwt_token
```

**Request Body:**
```json
{
  "title": "string",
  "link": "string",
  "type": "string"
}
```

#### GET `/api/v1/getcontent`
Retrieve all user's content (requires authentication).

**Headers:**
```
Authorization: your_jwt_token
```

**Response:**
```json
{
  "content": [
    {
      "id": 1,
      "title": "Content Title",
      "link": "https://example.com",
      "type": "article",
      "userId": 1,
      "user": {
        "id": 1,
        "username": "john_doe"
      }
    }
  ]
}
```

#### DELETE `/api/v1/deletecontent`
Delete specific content (requires authentication).

**Headers:**
```
Authorization: your_jwt_token
```

**Request Body:**
```json
{
  "contentId": 1
}
```

### Content Sharing

#### POST `/api/v1/share`
Create or delete a shareable link for your content collection.

**Headers:**
```
Authorization: your_jwt_token
```

**Request Body:**
```json
{
  "share": true // true to create, false to delete
}
```

**Response (when creating):**
```json
{
  "message": "Link created successfully",
  "link": {
    "id": 1,
    "hash": "randomhash123",
    "userId": 1
  }
}
```

#### GET `/api/v1/:shareLink`
Access shared content via hash (no authentication required).

**Response:**
```json
{
  "message": "Link found",
  "content": [
    {
      "id": 1,
      "title": "Shared Content",
      "link": "https://example.com",
      "type": "article",
      "user": {
        "username": "john_doe"
      }
    }
  ]
}
```

## Database Schema

The application uses the following database models:

- **User**: Stores user credentials and relationships
- **Content**: Stores user's saved content items
- **Link**: Manages shareable links for content collections
- **Tag**: For future content categorization (currently unused)

## Project Structure

```
├── config.ts          # JWT configuration
├── middleware.ts      # Authentication middleware
├── links.ts          # Hash generation utility
├── types.ts          # TypeScript type definitions
├── schema.prisma     # Database schema
├── main.ts           # Main application file
└── test.ts           # Database testing utilities
```

## Security Features

- Password validation (minimum 8 characters)
- Username validation (1-20 characters)
- JWT token authentication for protected routes
- User-specific content isolation
- Secure random hash generation for shareable links

## Error Handling

The API includes comprehensive error handling for:
- Invalid input validation
- Authentication failures
- Database connection issues
- Resource not found scenarios
- Internal server errors

## Development

### Running Tests
```bash
# Test database connectivity
node test.js
```

### Database Operations
```bash
# View database in Prisma Studio
npx prisma studio

# Reset database
npx prisma migrate reset

# Deploy migrations to production
npx prisma migrate deploy
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request


## Support

For questions or issues, please create an issue in the repository or contact the development team.