const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { default: mongoose } = require("mongoose");
const cors = require("cors");
const app = express();
const httpServer = createServer(app);
require("dotenv").config();
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

mongoose.connect(process.env.MONGO_DB_CLIENT);

const userSchema = new mongoose.Schema(
  {
    sessionId: String,
    userId: String,
    username: String,
    role: String,
    voteResult: Number,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },

  { timestamps: true }
);

userSchema.path("createdAt").index({ expireAfterSeconds: 1800 });
const UserSessionEntry = mongoose.model("Poker-Session", userSchema);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

io.on("connection", (socket) => {
  console.log("a user connected with ID" + socket.id);

  socket.on("join-room", async (msg) => {
    socket.join(msg.sessionId);
    console.log(
      `Message received: ${msg.userId}, ${msg.username}, ${msg.sessionId}, ${msg.role}, ${msg.voteResult}`
    );
    const userExist = await UserSessionEntry.findOne({ userId: msg.userId });

    try {
      if (!userExist) {
        const newEntry = new UserSessionEntry({
          sessionId: msg.sessionId,
          userId: msg.userId,
          username: msg.username,
          role: msg.role,
          voteResult: msg.voteResult,
        });

        await newEntry.save();
        console.log("Message saved to database");

        const sessionData = await UserSessionEntry.find({
          sessionId: msg.sessionId,
        });
        console.log(`Session Data from DB of current session: ${sessionData}`);
        io.to(msg.sessionId).emit("room-joined", {
          users: sessionData,
        });
      }
    } catch (error) {
      console.log(`error saving message: ${error}`);
    }
  });

  socket.on("updateVote", async (msg) => {
    try {
      const sessionData = await UserSessionEntry.findOneAndUpdate(
        {
          userId: msg.userId,
        },
        { voteResult: msg.voteResult }
      );

      const newSessionData = await UserSessionEntry.find({
        sessionId: msg.sessionId,
      });
      console.log(`Session Data from DB of current session: ${sessionData}`);
      io.to(msg.sessionId).emit("room-joined", {
        users: newSessionData,
      });
    } catch (error) {
      console.log(`error receving data: ${error}`);
    }
  });

  socket.on("resetVote", async (msg) => {
    try {
      const sessionData = await UserSessionEntry.updateMany(
        { sessionId: msg.sessionId },
        {
          voteResult: 0,
        }
      );

      const newSessionData = await UserSessionEntry.find({
        sessionId: msg.sessionId,
      });
      console.log(`Session Data from DB of current session: ${sessionData}`);
      io.to(msg.sessionId).emit("room-joined", {
        users: newSessionData,
      });
      io.to(msg.sessionId).emit("votesResetted", {});
    } catch (error) {
      console.log(`Error resetting: ${error}`);
    }
  });

  socket.on("showVotes", (msg) => {
    io.to(msg.sessionId).emit("votesShown", {});
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
