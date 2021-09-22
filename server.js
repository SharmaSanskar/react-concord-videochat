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

const allRooms = {};

io.on("connection", (socket) => {
  socket.on("join", ({ userId }) => {
    socket.join(userId);
    // console.log("Joined id:" + userId);
  });

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

  // Room call
  socket.on("join room", ({ roomId, memberId }) => {
    if (allRooms[roomId]) {
      allRooms[roomId].push(memberId);
    } else {
      allRooms[roomId] = [memberId];
    }
    const membersInRoom = allRooms[roomId].filter((id) => id !== memberId);
    socket.emit("all members", membersInRoom);
  });

  socket.on(
    "sending signal to member",
    ({ memberToSignal, newMemberId, signalData }) => {
      io.to(memberToSignal).emit("new member", { signalData, newMemberId });
    }
  );

  socket.on(
    "returning to new member",
    ({ signalData, newMemberId, memberId }) => {
      io.to(newMemberId).emit("receiving returned signal", {
        signalData,
        memberId,
      });
    }
  );

  socket.on("invite", ({ memberToCall, roomId, roomName }) => {
    io.to(memberToCall).emit("room call incoming", { roomId, roomName });
  });

  socket.on("room call ended", (roomId) => {
    allRooms[roomId]?.forEach((id) => {
      io.to(id).emit("room call over");
    });
    delete allRooms[roomId];
  });
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
