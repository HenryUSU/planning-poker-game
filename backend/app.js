const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();
const httpServer = createServer(app);
const port = 3000;

const rooms = {};

function addUserToRoom(sessionId, userId, username) {
  if (!rooms[sessionId]) {
    rooms[sessionId] = [];
  }
  rooms[sessionId].push({ userId, username, voteResult: null });
}

function removeUserFromRoom(sessionId, userId) {
  if (rooms[sessionId]) {
    rooms[sessionId] = rooms[sessionId].filter(
      (user) => user.userId !== userId
    );
    if (rooms[sessionId].length === 0) {
      delete rooms[sessionId];
    }
  }
}

function updateUserVote(sessionId, userId, vote) {
  if (rooms[sessionId]) {
    const user = rooms[sessionId].find((user) => user.userId === userId);
    if (user) {
      user.voteResult = vote;
    }
  }
}

app.use(cors());
const io = new Server(httpServer, {
  /* options */
  path: "/session/",
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

io.on("connection", (socket) => {
  console.log("a user connected with ID" + socket.id);

  socket.on("testEvent", (msg) => {
    console.log(`message: ${msg}`);
  });

  socket.on("join_room", ({ userId, username, sessionId }) => {
    socket.join(sessionId);
    addUserToRoom(sessionId, userId, username);

    console.log(`User ${username} joined room: ${sessionId}`);

    // io.to(sessionId).emit("join_room", {
    //   id: userId,
    //   user: username,
    //   voteResult: 0,
    // });
    console.log(rooms[sessionId]);
    io.to(sessionId).emit("join_room", {
      users: rooms[sessionId],
    });
  });

  // socket.on("user_joined", ({ userId, username }) => {
  //   console.log(`User joined: ${username}`);
  //   io.emit("user_joined", {
  //     id: userId,
  //     user: username,
  //     voteResult: 0,
  //   });
  // });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
