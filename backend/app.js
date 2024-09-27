const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();
const httpServer = createServer(app);
const port = 3000;

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
  socket.on("user_joined", ({ userId, username }) => {
    console.log(`User joined: ${username}`);
    io.emit("user_joined", {
      id: userId,
      user: username,
      voteResult: 0,
    });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
