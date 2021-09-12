const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());

const PORT = process.env.PORT || 5000;

io.on("connection", (socket) => {
  socket.on("join", ({ userId }) => {
    socket.join(userId);
    console.log("Joined id:" + userId);
  });

  // socket.on("disconnect", () => {
  //   socket.broadcast.emit("endCall");
  // });

  socket.on("callEnded", ({ otherUser }) => {
    io.to(otherUser).emit("endCall");
  });

  socket.on(
    "callUser",
    ({ userToCall, signalData, callerId, callerName, videoCallId }) => {
      io.to(userToCall).emit("callIncoming", {
        signalData,
        callerId,
        callerName,
        videoCallId,
      });
    }
  );

  socket.on("answerCall", ({ callingUser, signalData }) => {
    io.to(callingUser).emit("callAccepted", signalData);
  });
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
