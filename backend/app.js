const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { default: mongoose } = require("mongoose");
const cors = require("cors");
const { type } = require("os");
const app = express();
const httpServer = createServer(app);
const { v4: uuidv4 } = require("uuid");
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
  // connectionStateRecovery: {
  //   // the backup duration of the sessions and the packets
  //   maxDisconnectionDuration: 2 * 60 * 1000,
  //   // whether to skip middlewares upon successful recovery
  //   skipMiddlewares: true,
  // },
});

mongoose.connect(process.env.MONGO_DB_CLIENT);

const userSchema = new mongoose.Schema(
  {
    sessionId: String,
    userId: String,
    socketId: String,
    username: String,
    role: String,
    voteResult: Number,
    hasVoted: {
      type: Boolean,
      default: false,
    },
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

  socket.on("createSessionId", () => {
    const sessionId = uuidv4();
    console.log(`sessionId generated with Id: ${sessionId}`);
    socket.emit("sessionIdGenerated", { sessionId: sessionId });
  });

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
          socketId: socket.id,
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
        io.to(msg.sessionId).emit("updateData", {
          users: sessionData,
        });
      }
    } catch (error) {
      console.log(`error saving message: ${error}`);
    }
  });

  socket.on("getOrganizer", async (msg) => {
    console.log(`session id from frontend to get organizer: ${msg.sessionId}`);
    try {
      const organizer = await UserSessionEntry.findOne({
        sessionId: msg.sessionId,
        role: "productmanager",
      });
      console.log(`Organizer from database: ${organizer.username}`);
      io.to(msg.sessionId).emit("setOrganizer", {
        username: organizer.username,
      });
    } catch (error) {
      console.log(`error receiving Organizer: ${error}`);
    }
  });

  socket.on("updateVote", async (msg) => {
    try {
      const sessionData = await UserSessionEntry.findOneAndUpdate(
        {
          userId: msg.userId,
        },
        { voteResult: msg.voteResult, hasVoted: true }
      );

      const newSessionData = await UserSessionEntry.find({
        sessionId: msg.sessionId,
      });
      console.log(`Session Data from DB of current session: ${sessionData}`);
      io.to(msg.sessionId).emit("updateData", {
        users: newSessionData,
      });
      io.to(msg.sessionId).emit("hasVoted", {});
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
          hasVoted: false,
        }
      );

      const newSessionData = await UserSessionEntry.find({
        sessionId: msg.sessionId,
      });
      console.log(`Session Data from DB of current session: ${sessionData}`);
      io.to(msg.sessionId).emit("updateData", {
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

  socket.on("disconnect", async () => {
    try {
      const currentSessionId = await UserSessionEntry.findOne({
        socketId: socket.id,
      });
      const newSessionData = await UserSessionEntry.find({
        sessionId: currentSessionId.sessionId,
      });

      io.to(currentSessionId.sessionId).emit("updateData", {
        users: newSessionData,
      });
    } catch (error) {
      console.log(`error: ${error}`);
    }

    await UserSessionEntry.deleteOne({ socketId: socket.id });
    console.log(`Client disconnected, deleting id ${socket.id}from DB`);
  });
});
