# API Documentation

Complete API reference for NomNom application.

## Table of Contents

- [Chat API](#chat-api)
- [Todo API](#todo-api)
- [Upload API](#upload-api)
- [Admin API](#admin-api)

---

## Chat API

### Get Recent Messages

```http
GET /api/chat?limit=50
```

**Query Parameters:**
- `limit` (optional): Number of messages to retrieve (default: 50)

**Response:**
```json
{
  "messages": [
    {
      "id": "uuid",
      "userId": "uuid",
      "username": "string",
      "message": "string",
      "timestamp": "ISO8601",
      "fileUrl": "string (optional)",
      "fileName": "string (optional)",
      "fileType": "string (optional)",
      "fileSize": "number (optional)"
    }
  ]
}
```

### Send Message

```http
POST /api/chat
```

**Request Body:**
```json
{
  "userId": "uuid",
  "username": "string",
  "message": "string",
  "fileUrl": "string (optional)",
  "fileName": "string (optional)",
  "fileType": "string (optional)",
  "fileSize": "number (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": {
    "id": "uuid",
    "userId": "uuid",
    "username": "string",
    "message": "string",
    "timestamp": "ISO8601",
    "fileUrl": "string (optional)",
    "fileName": "string (optional)",
    "fileType": "string (optional)",
    "fileSize": "number (optional)"
  }
}
```

**Error Responses:**
- `400`: Missing required fields, invalid username, or inappropriate content
- `429`: Rate limit exceeded (5 messages per minute)
- `500`: Internal server error

---

## Todo API

### List Todos

```http
GET /api/todos?limit=100&completed=true
```

**Query Parameters:**
- `limit` (optional): Number of todos to retrieve (default: 100)
- `completed` (optional): Filter by completion status (`true` or `false`)

**Response:**
```json
{
  "todos": [
    {
      "id": "uuid",
      "title": "string",
      "isCompleted": "boolean",
      "createdAt": "ISO8601"
    }
  ],
  "count": "number"
}
```

### Create Todo

```http
POST /api/todos
```

**Request Body:**
```json
{
  "title": "string (max 500 chars)"
}
```

**Response:**
```json
{
  "success": true,
  "todo": {
    "id": "uuid",
    "title": "string",
    "isCompleted": false,
    "createdAt": "ISO8601"
  }
}
```

**Error Responses:**
- `400`: Title is required, empty, or exceeds 500 characters
- `500`: Internal server error

### Get Single Todo

```http
GET /api/todos/:id
```

**Response:**
```json
{
  "todo": {
    "id": "uuid",
    "title": "string",
    "isCompleted": "boolean",
    "createdAt": "ISO8601"
  }
}
```

**Error Responses:**
- `404`: Todo not found
- `500`: Internal server error

### Update Todo

```http
PUT /api/todos/:id
```

**Request Body:**
```json
{
  "title": "string (optional, max 500 chars)",
  "isCompleted": "boolean (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "todo": {
    "id": "uuid",
    "title": "string",
    "isCompleted": "boolean",
    "createdAt": "ISO8601"
  }
}
```

**Error Responses:**
- `400`: Invalid fields or no fields to update
- `404`: Todo not found
- `500`: Internal server error

### Delete Todo

```http
DELETE /api/todos/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Todo deleted successfully"
}
```

**Error Responses:**
- `404`: Todo not found
- `500`: Internal server error

---

## Upload API

### Upload File

```http
POST /api/upload
```

**Authentication:** Required (Supabase Auth)

**Request:**
- Content-Type: `multipart/form-data`
- Body: FormData with `file` field

**Allowed File Types:**
- Images: JPEG, JPG, PNG, GIF, WebP
- Documents: PDF, TXT, DOC, DOCX

**File Size Limit:** 10 MB

**Response:**
```json
{
  "success": true,
  "file": {
    "url": "string",
    "name": "string",
    "type": "string",
    "size": "number"
  }
}
```

**Error Responses:**
- `400`: No file provided, file too large, or file type not allowed
- `401`: Unauthorized
- `500`: Internal server error

---

## Admin API

All admin endpoints require authentication.

### Get All Users

```http
GET /api/admin/users
```

**Authentication:** Required

**Response:**
```json
{
  "users": [
    {
      "id": "uuid",
      "username": "string",
      "createdAt": "ISO8601",
      "updatedAt": "ISO8601",
      "_count": {
        "Message": "number"
      }
    }
  ]
}
```

### Get All Messages

```http
GET /api/admin/messages?limit=100
```

**Authentication:** Required

**Query Parameters:**
- `limit` (optional): Number of messages to retrieve (default: 100)

**Response:**
```json
{
  "messages": [
    {
      "id": "uuid",
      "userId": "uuid",
      "username": "string",
      "message": "string",
      "timestamp": "ISO8601",
      "fileUrl": "string (optional)",
      "fileName": "string (optional)",
      "fileType": "string (optional)",
      "fileSize": "number (optional)"
    }
  ]
}
```

### Delete Message

```http
DELETE /api/admin/messages/:id
```

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "message": "Message deleted successfully"
}
```

**Error Responses:**
- `401`: Unauthorized
- `404`: Message not found
- `500`: Internal server error

### Get All Todos (Admin)

```http
GET /api/admin/todos
```

**Authentication:** Required

**Response:**
```json
{
  "todos": [
    {
      "id": "uuid",
      "title": "string",
      "isCompleted": "boolean",
      "createdAt": "ISO8601"
    }
  ]
}
```

---

## Rate Limiting

The chat API implements rate limiting:
- **Limit:** 5 messages per minute per user
- **Window:** 60 seconds
- **Response:** HTTP 429 when limit exceeded
- **Storage:** Redis (Upstash/ioredis) or in-memory fallback

---

## Error Handling

All endpoints follow consistent error response format:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `429`: Too Many Requests
- `500`: Internal Server Error

---

## Authentication

Authentication is handled via Supabase Auth. Protected endpoints require:
- Valid Supabase session cookie
- User must be authenticated

To authenticate:
1. Sign up/login via `/login` page
2. Session cookie is automatically managed
3. API calls include authentication automatically

---

## Realtime Features

### WebSocket Chat

The application uses Supabase Realtime for live chat updates:

```typescript
import { RealtimeChat } from '@/lib/realtime';

const realtime = new RealtimeChat();
const unsubscribe = realtime.subscribe((message) => {
  console.log('New message:', message);
});

// Cleanup
unsubscribe();
```

**Features:**
- Real-time message delivery
- Automatic reconnection
- File attachment support
- No polling required

---

## Examples

### Send a chat message with file

```javascript
// 1. Upload file
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const uploadResponse = await fetch('/api/upload', {
  method: 'POST',
  body: formData,
});

const { file } = await uploadResponse.json();

// 2. Send message with file reference
const messageResponse = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user-uuid',
    username: 'john_doe',
    message: 'Check out this file!',
    fileUrl: file.url,
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
  }),
});
```

### Create and update a todo

```javascript
// Create
const createResponse = await fetch('/api/todos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Complete project documentation',
  }),
});

const { todo } = await createResponse.json();

// Update
const updateResponse = await fetch(`/api/todos/${todo.id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    isCompleted: true,
  }),
});
```

---

## Testing

### Test Rate Limiting

```bash
# Send 7 messages rapidly (should get 5 success, 2 rate limited)
for i in {1..7}; do
  curl -X POST http://localhost:3000/api/chat \
    -H "Content-Type: application/json" \
    -d "{\"userId\": \"test\", \"username\": \"user\", \"message\": \"Test $i\"}"
done
```

### Test Todo CRUD

```bash
# Create
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Test todo"}'

# List
curl http://localhost:3000/api/todos

# Update
curl -X PUT http://localhost:3000/api/todos/{id} \
  -H "Content-Type: application/json" \
  -d '{"isCompleted": true}'

# Delete
curl -X DELETE http://localhost:3000/api/todos/{id}
```
