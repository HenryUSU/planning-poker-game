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
const PORT = process.env.PORT || 3000;

// CORS configuration for Express
const corsOptions = {
  origin: `${process.env.FRONTEND_URL}`,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

const io = new Server(httpServer, {
  /* options */
  path: "/session/",
  cors: {
    origin: `${process.env.FRONTEND_URL}`,
    methods: ["GET", "POST"],
    credentials: true,
  },
  // connectionStateRecovery: {
  //   // the backup duration of the sessions and the packets
  //   maxDisconnectionDuration: 2 * 60 * 1000,
  //   // whether to skip middlewares upon successful recovery
  //   skipMiddlewares: true,
  // },
});

mongoose.connect(process.env.MONGO_DB_CLIENT);

//schema for database
const userSchema = new mongoose.Schema(
  {
    sessionId: String,
    userId: String,
    socketId: String,
    username: String,
    role: String,
    voteResult: String,
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

//in case deletion goes wrong, delete all data after 30 minutes
userSchema.path("createdAt").index({ expireAfterSeconds: 1800 });
const UserSessionEntry = mongoose.model("Poker-Session", userSchema);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

httpServer.listen(PORT, () => {
  console.log(`Example app listening on PORT ${PORT}`);
});

io.on("connection", (socket) => {
  console.log("a user connected with ID" + socket.id);

  //list to emit from frontend to create a new session id
  socket.on("createSessionId", () => {
    const sessionId = uuidv4();
    console.log(`sessionId generated with Id: ${sessionId}`);
    socket.emit("sessionIdGenerated", { sessionId: sessionId });
  });

  //listens to emits from frontend if user joins a room, then create a new entry in database with all user data
  //then load updated data from database end emit it to frontend as "updateData"
  socket.on("join-room", async (msg) => {
    socket.join(msg.sessionId);
    console.log(
      `Message received: ${msg.userId}, ${msg.username}, ${msg.sessionId}, ${msg.role}, ${msg.voteResult}`
    );

    const userExist = await UserSessionEntry.findOne({ userId: msg.userId });

    //delete all data
    // const result = await UserSessionEntry.deleteMany({});
    // console.log(`Deleted ${result.deletedCount} documents`);

    // const emptySession = await UserSessionEntry.findOne({
    //   sessionId: "",
    //   role: "productmanager",
    // });
    // console.log(`empty session: ${emptySession}`);

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
      // else {
      //   const updatedUser = await UserSessionEntry.findOneAndUpdate(
      //     { sessionId: "", role: "productmanager" },
      //     {
      //       $set: {
      //         sessionId: msg.sessionId,
      //       },
      //     },
      //     { new: true, upsert: true }
      //   );

      //   if (!updatedUser) {
      //     throw new Error("Failed to update or insert user");
      //   }

      //   console.log("User data updated or inserted successfully");

      //   const sessionData = await UserSessionEntry.find({
      //     sessionId: msg.sessionId,
      //   });
      //   console.log(`Session Data from DB of current session: ${sessionData}`);

      //   io.to(msg.sessionId).emit("updateData", { users: sessionData });
      // }
    } catch (error) {
      console.log(`error saving message: ${error}`);
    }
  });

  //listens to socket from frontend to get an organizer. Look in database for current session id and role = productmanager
  //emit the organizer name to frontend
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

  //listens to socket from fontent to get observers. Look in the database for current session id and role = observer
  //emit the observer list to frontend
  socket.on("getObservers", async (msg) => {
    console.log(`session id from frontend to get observer: ${msg.sessionId}`);
    try {
      const observers = await UserSessionEntry.find({
        sessionId: msg.sessionId,
        role: "observer",
      });
      console.log(`Observer list from DB of current session: ${observers}`);
      io.to(msg.sessionId).emit("setObservers", { users: observers });
    } catch (error) {
      console.log(`error receving data: ${error}`);
    }
  });

  //listen to socket with votes from frontend. Update database for current user with vote result and set hasVoted status to true
  //then load updated data from database end emit it to frontend as "updateData"
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
    } catch (error) {
      console.log(`error receving data: ${error}`);
    }
  });

  //listen to sockets for reseted votes. Then reset all votes for current session id in database and set vote status false
  //listen to socket with votes from frontend. Update database for current user with vote result and set hasVoted status to true
  //then load updated data from database end emit it to frontend as "updateData"
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

  //listen to sockets to show votes and emit socket to frontend
  socket.on("showVotes", (msg) => {
    io.to(msg.sessionId).emit("votesShown", {});
  });

  //try to remove users who have left the session from database
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
