# Chat (Socket.IO) Integration
1
This document describes how to connect your frontend (User website + Admin panel) to the backend real-time chat.

## Core Principles

- MySQL is the **source of truth** (all messages are persisted first).
- Socket.IO/WebSocket is the **delivery mechanism** (real-time updates only).

Because of this:

- Refreshing the page is safe (re-fetch from MySQL via `chat:history` / `chat:sync`).
- Reconnecting is safe (sync missed messages by last known `message.id`).
- If one side is offline, messages still persist and will be delivered after reconnect.

## Auth (IMPORTANT)

Sockets are authenticated using your existing **session-based auth** (Passport + express-session).

Requirements:

- Your frontend must login via HTTP (`/auth/login` or Google OAuth) and store the session cookie.
- Your Socket.IO connection must include cookies.

### Browser CORS + cookies

The backend is configured with:

- Express CORS: `credentials: true`
- Socket.IO CORS: `credentials: true`

On the frontend:

- `fetch`: use `credentials: 'include'`
- `axios`: use `withCredentials: true`
- Socket.IO: set `withCredentials: true`

If the socket connects without a session, the server rejects with `Unauthorized`.

## Rooms (server-side concept)

The backend automatically joins sockets into rooms:

- User room: `user:<userId>`
- Admin user room: `user:<ADMIN_USER_ID>` (default: `user:1`)

Meaning:

- A user only receives events for their own room.
- The admin account receives events via the admin user's room.

## Message model

Messages are stored in MySQL table `messages`.

Fields you will see in socket payloads:

```json
{
  "id": 123,
  "conversation_id": 55,
  "sender_role": "user",
  "sender_id": 10,
  "message_type": "text",
  "message": { "text": "hello" },
  "created_at": "2026-02-08T18:30:00.000Z"
}
```

### `message_type` and `message`

- `text`
  - `message` is `{ "text": "..." }`
- `media`
  - `message` is `{ "url": "https://..." }`

## Media upload (images/videos) via backend

The frontend should **not** send raw files over Socket.IO.

Instead:

1) Upload the file to backend via HTTP.
2) Send a `message_type: 'media'` with the returned `url`.

### Upload endpoint

`POST /chat/upload`

Auth:

- Requires a valid session cookie (same as other protected endpoints)

Form-data:

- field name: `file`
- allowed: `image/*` and `video/*`

Response:

```json
{
  "success": true,
  "file_id": "a285e6dbc0a780114abec11f9b5c9a59",
  "url": "http://cdn.edge.arkd.shop/cdn/a285e6dbc0a780114abec11f9b5c9a59",
  "mime": "image/png",
  "kind": "image"
}
```

Notes:

- Your app backend forwards uploads to the CDN origin:
  - `http://cdn.origin.arkd.shop/api/upload`
- The returned `url` is the CDN edge URL (cached delivery):
  - `http://cdn.edge.arkd.shop/cdn/<file_id>`

## CDN reference (Origin + Edge)

This section is a quick reference for how the CDN works for uploaded chat media.

### CDN Origin Server

Base URL:

- `http://cdn.origin.arkd.shop`

Public routes:

- `POST /api/upload`
- `GET /api/files/:id`
- `GET /api/files/:id/download`
- `DELETE /api/files/:id`

Admin routes:

- `GET /api/admin/files`
- `POST /api/admin/purge/:id`

### CDN Edge Server

Base URL:

- `http://cdn.edge.arkd.shop`

CDN routes:

- `GET /cdn/:file_id`

Cache control:

- `POST /api/purge/:file_id`

### Flow (mental model)

Client

- `GET http://cdn.edge.arkd.shop/cdn/:file_id`

Edge (cache miss) -> Origin

- `GET http://cdn.origin.arkd.shop/api/files/:id/download`

Admin purge:

- Origin: `POST http://cdn.origin.arkd.shop/api/admin/purge/:id`
- Edge: `POST http://cdn.edge.arkd.shop/api/purge/:file_id`

## Socket.IO connection

### Client install

Use Socket.IO client version compatible with your backend `socket.io` version.

### Connect (User site)

```js
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  withCredentials: true,
  transports: ['websocket'],
});

socket.on('connect', () => {
  console.log('connected', socket.id);
});

socket.on('connect_error', (err) => {
  console.log('connect_error', err.message);
});
```

### Connect (Admin panel)

Same as user, but admin account must have `users.is_admin = 1`.

## Events

### 1) Send a message

Event: `message:send`

#### User -> Admin

```js
socket.emit('message:send', {
  message_type: 'text',
  message: 'Hello admin'
});
```

Notes:

- `receiver_id` is **not required** for user messages (it always goes to admins).

#### Admin -> User

```js
socket.emit('message:send', {
  receiver_id: 123,
  message_type: 'text',
  message: 'Hello from admin'
});
```

Notes:

- `receiver_id` is **required** for admin messages.

#### Server acknowledgements

- `message:sent`
  - emitted back to the sender after the message is persisted
- `message:error`
  - emitted back to the sender if persistence fails

### 2) Receive new messages

Event: `message:new`

```js
socket.on('message:new', (message) => {
  // append to UI
});
```

### 3) Load history (pagination)

Event: `chat:history`

Request (User):

```js
socket.emit('chat:history', {
  user_id: currentUserId,
  limit: 50
});
```

Request (Admin):

```js
socket.emit('chat:history', { user_id: selectedUserId, limit: 50 }, (res) => {
  if (!res?.success) return;
  // res.messages is newest-first; reverse for UI if needed
});
```

Optional pagination:

- Provide `before_id` to fetch older messages.

```js
socket.emit('chat:history', {
  user_id: selectedUserId,
  limit: 50,
  before_id: oldestMessageIdInUI
});
```

Response:

```json
{
  "success": true,
  "conversation_id": 55,
  "user_id": 123,
  "messages": [
    { "id": 999, "message_type": "text", "message": {"text":"..."} }
  ]
}
```

Notes:

- Messages are returned in **descending id** order (newest first). Reverse in UI if needed.

### 4) Sync missed messages (reconnect/offline)

Event: `chat:sync`

Use this when:

- user refreshes
- admin reconnects
- browser was offline

Store the last message id you have for that conversation, then:

```js
socket.emit('chat:sync', {
  user_id: selectedUserId,
  after_id: lastMessageId
}, (res) => {
  if (!res?.success) return;
  // append res.messages
});
```

Response:

```json
{
  "success": true,
  "conversation_id": 55,
  "user_id": 123,
  "messages": [ ... ]
}
```

## Admin panel specifics

### Admin identity (IMPORTANT)

The server treats the **admin chat account** as:

- `ADMIN_USER_ID` env var (default `1`)
- `isAdmin = (socket.request.user.id === ADMIN_USER_ID)`

So your admin panel must authenticate as that account.

### Admin -> User sending

When sending as admin, you **must** include `receiver_id`:

```js
socket.emit('message:send', {
  receiver_id: selectedUserId,
  message_type: 'text',
  message: 'Hello from admin'
});

#### Send media

After uploading media and receiving a `url`:

```js
socket.emit('message:send', {
  // admin must include receiver_id
  receiver_id: selectedUserId,
  message_type: 'media',
  message: 'http://localhost:3000/uploads/chat/123.png'
});
```
```

### Admin history/sync

For admin history and sync, always pass the target `user_id`:

```js
socket.emit('chat:history', { user_id: selectedUserId, limit: 50 }, (res) => {
  if (!res?.success) return;
  // res.messages is newest-first; reverse for UI if needed
});

socket.emit('chat:sync', { user_id: selectedUserId, after_id: lastMessageId }, (res) => {
  if (!res?.success) return;
  // append res.messages
});
```

## Custom product cards (frontend feature)

If a **text** message contains an internal service URL like:

`/services/<type>/<category>/<slug>`

or a full URL containing that path, the frontend can render a custom product card.

Recommended implementation:

- Parse the path from the message text.
- Fetch product details from backend (via Next rewrite):
  - `GET /api/<category>/<type>/<slug>`
- Render a clickable card that navigates to the original `/services/...` URL.

## Recommended frontend state strategy

Per conversation (per user):

- Keep `lastMessageId` in local state (and optionally localStorage).
- On connect:
  - call `chat:history` for initial load
  - call `chat:sync` with `after_id = lastMessageId` to fetch missed
- On `message:new`:
  - append
  - update `lastMessageId`

## Error handling

- Listen for `message:error` to show retry UI.
- Listen for `connect_error` and show reconnecting state.

## Common pitfalls

- If you don’t see messages in frontend:
  - confirm your HTTP login works and cookie is set
  - confirm you connect socket with `withCredentials: true`
  - confirm backend CORS allows your frontend origin
- If admin is not receiving:
  - confirm the admin user has `is_admin = 1`

