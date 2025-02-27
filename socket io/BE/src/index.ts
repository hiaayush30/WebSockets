import { Request, Response } from "express";
import cors from 'cors'
import express from 'express';
import { Server, Socket } from 'socket.io'
import { createServer } from "http";

const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.get('/', (req: Request, res: Response) => {
    res.send("hello");
});

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket: Socket) => {
    console.log("user connected");
    console.log("id" + socket.id);
})

server.listen(3000, () => {
    console.log('listening on *:3000');
});