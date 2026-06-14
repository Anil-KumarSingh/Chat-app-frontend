# Real-Time Chat Application

A full-stack real-time one-to-one chat application built with **React.js**, **Node.js**, **Express.js**, **Socket.IO**, **MongoDB**, **JWT Authentication**, and **Tailwind CSS**.

---

## ✨ Features

- User registration & login with JWT authentication
- Passwords hashed with bcryptjs
- Protected routes (frontend & backend)
- Real-time one-to-one messaging via Socket.IO
- Online / offline status indicators
- Typing indicator
- Message timestamps
- Auto-scroll to latest message
- Persistent chat history stored in MongoDB
- Responsive UI (mobile & desktop) built with Tailwind CSS

---

## 📁 Project Structure

```
chat-app/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── Message.jsx
│   │   │   └── TypingIndicator.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Chat.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── socket.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   └── Message.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── messageController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   └── messageRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── socket/
│   │   └── socketHandler.js
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## 🛠️ Tech Stack

**Frontend:** React.js (Vite), Tailwind CSS, React Router, Socket.IO Client, Axios
**Backend:** Node.js, Express.js, Socket.IO, JWT, bcryptjs
**Database:** MongoDB, Mongoose

---

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) running locally (or a MongoDB Atlas connection string)

---

## 🚀 Installation & Setup

### 1. Backend Setup

```bash
cd chat-app/backend
npm install
```

The `.env` file is already provided with default values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/chat-app
JWT_SECRET=super_secret_jwt_key_change_this_in_production
CLIENT_URL=http://localhost:5173
```

> Make sure MongoDB is running locally on the default port (`27017`), or update `MONGO_URI` to point to your MongoDB Atlas cluster.

Start the backend server:

```bash
npm start
```

For development with auto-restart on file changes:

```bash
npm run dev
```

The backend will run on **http://localhost:5000**.

---

### 2. Frontend Setup

Open a new terminal window:

```bash
cd chat-app/frontend
npm install
npm run dev
```

The frontend will run on **http://localhost:5173**.

---

## 🔌 API Endpoints

| Method | Endpoint              | Description                          | Auth Required |
|--------|-----------------------|---------------------------------------|----------------|
| POST   | `/api/auth/register`  | Register a new user                   | No             |
| POST   | `/api/auth/login`     | Login and receive a JWT token         | No             |
| GET    | `/api/users`          | Get list of all users (except self)   | Yes            |
| GET    | `/api/messages/:userId` | Get chat history with a user        | Yes            |
| POST   | `/api/messages`       | Save a new message (REST fallback)    | Yes            |

All protected routes require an `Authorization: Bearer <token>` header.

---

## 🔄 Socket.IO Events

### Client → Server
| Event         | Payload                              | Description                       |
|---------------|---------------------------------------|------------------------------------|
| `join`        | –                                     | Join personal room after connecting |
| `sendMessage` | `{ receiverId, message }`            | Send a new chat message            |
| `typing`      | `{ receiverId }`                      | Notify receiver that user is typing |
| `stopTyping`  | `{ receiverId }`                      | Notify receiver typing has stopped  |

### Server → Client
| Event            | Payload                            | Description                          |
|------------------|--------------------------------------|----------------------------------------|
| `receiveMessage` | Message object                     | New message for sender or receiver     |
| `userOnline`     | `userId`                            | A user has come online                  |
| `userOffline`    | `userId`                            | A user has gone offline                 |
| `typing`         | `{ senderId }`                      | Someone is typing to you                |
| `stopTyping`     | `{ senderId }`                      | Someone stopped typing                  |

The socket connection is authenticated using the JWT token sent in `socket.handshake.auth.token`.

---

## 🗄️ Database Models

### User
| Field         | Type    | Description                |
|---------------|---------|----------------------------|
| name          | String  | User's display name        |
| email         | String  | Unique email address       |
| password      | String  | Hashed password (bcrypt)   |
| onlineStatus  | Boolean | Whether user is online     |
| createdAt     | Date    | Account creation timestamp |

### Message
| Field       | Type     | Description                  |
|-------------|----------|-------------------------------|
| senderId    | ObjectId | Reference to sender User      |
| receiverId  | ObjectId | Reference to receiver User    |
| message     | String   | Message text                  |
| timestamp   | Date     | When the message was sent     |

---

## 🧪 How to Test

1. Open the app at `http://localhost:5173` in two different browsers (or one normal + one incognito window).
2. Register two different accounts (e.g. Alice and Bob).
3. Log in as Alice in one window and Bob in the other.
4. Select each other from the sidebar and start chatting in real time.
5. Watch the online/offline indicators and typing indicator update live.

---

## 📝 Notes

- The frontend expects the backend to be running on `http://localhost:5000`. If you change the backend port, update `API_URL` in `frontend/src/services/api.js` and `SOCKET_URL` in `frontend/src/services/socket.js`.
- JWT tokens are stored in `localStorage` along with basic user info.
- Make sure to change `JWT_SECRET` in `.env` before deploying to production.
