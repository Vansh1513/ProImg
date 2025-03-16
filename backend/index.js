import express from "express";
import dotenv from "dotenv";
import connectDb from "./database/db.js";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import path from "path";
import passport from './controllers/passport.js';
import session from "express-session";
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';


dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.Cloud_Name,
  api_key: process.env.Cloud_Api,
  api_secret: process.env.Cloud_Secret,
});

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());


const port = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'qwertyuiop',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));


app.use(passport.initialize());
app.use(passport.session());

io.on('connection', (socket) => {
  console.log('User Connected:', socket.id);

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
  });

  socket.on('sendMessage', ({ roomId, message }) => {
    io.to(roomId).emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected:', socket.id);
  });
});


import userRoutes from "./routes/userRoutes.js";
import pinRoutes from "./routes/pinRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

app.use("/api/user", userRoutes);
app.use("/api/pin", pinRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectDb();
});