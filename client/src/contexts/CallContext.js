import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import Peer from "simple-peer";
import { io } from "socket.io-client";
import { AES } from "crypto-js";
import { useDispatch, useSelector } from "react-redux";
import { updateUserStatus } from "../actions/userAction";

const CallContext = createContext();
const socket = io("http://localhost:5000");

export const useCall = () => {
  return useContext(CallContext);
};

export const CallProvider = ({ children }) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [userToCallName, setUserToCallName] = useState("");
  const [stream, setStream] = useState();
  const [call, setCall] = useState({});

  const history = useHistory();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.users);

  const myVideo = useRef();
  const otherVideo = useRef();
  const connectionRef = useRef();

  const callUser = (receiverId, receiverName) => {
    setUserToCallName(receiverName);

    dispatch(
      updateUserStatus({
        id: currentUser.id,
        availabilityStatus: false,
      })
    );

    const urlData = {
      caller: currentUser.id,
      receiver: receiverId,
    };
    const videoCallId = AES.encrypt(
      JSON.stringify(urlData),
      "secret"
    ).toString();

    // Automatically leave if call not received
    const waitTime = setTimeout(() => {
      leaveCall(receiverId);
    }, 8000);

    const peer = new Peer({
      initiator: true,
      trickle: false,
      config: {
        iceServers: [
          {
            urls: [
              "stun:stun1.l.google.com:19302",
              "stun:stun2.l.google.com:19302",
            ],
          },
        ],
      },
      stream,
    });
    connectionRef.current = peer;

    connectionRef.current.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: receiverId,
        signalData: data,
        callerId: currentUser.id,
        callerName: currentUser.username,
        videoCallId: videoCallId,
      });
    });

    connectionRef.current.on("stream", (currentStream) => {
      if (otherVideo.current) {
        otherVideo.current.srcObject = currentStream;
      }
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      setUserToCallName("");
      clearTimeout(waitTime);
      connectionRef.current.signal(signal);
    });

    history.push(`/videocall/${videoCallId}`);
  };

  const answerCall = () => {
    setCallAccepted(true);
    dispatch(
      updateUserStatus({
        id: currentUser.id,
        availabilityStatus: false,
      })
    );

    const peer = new Peer({ initiator: false, trickle: false, stream });
    connectionRef.current = peer;

    connectionRef.current.on("signal", (data) => {
      socket.emit("answerCall", { callingUser: call.from, signalData: data });
    });

    connectionRef.current.on("stream", (currentStream) => {
      if (otherVideo.current) {
        otherVideo.current.srcObject = currentStream;
      }
    });

    connectionRef.current.signal(call.signal);

    history.push(`/videocall/${call.callUrl}`);
  };

  const leaveCall = (otherUserId) => {
    history.push("/");
    socket.emit("callEnded", {
      otherUser: otherUserId,
    });

    setCallEnded(true);
    setCall({});
    setCallAccepted(false);

    dispatch(
      updateUserStatus({
        id: otherUserId,
        availabilityStatus: true,
      })
    );
    dispatch(
      updateUserStatus({
        id: currentUser.id,
        availabilityStatus: true,
      })
    );

    if (connectionRef.current) connectionRef.current.destroy();
  };

  const connectToSocket = (userId) => {
    socket.emit("join", { userId });
  };

  useEffect(() => {
    socket.on("endCall", () => {
      history.push("/");
      setCallEnded(true);
      setCall({});
      setCallAccepted(false);
      if (connectionRef.current) connectionRef.current.destroy();
    });

    socket.on(
      "callIncoming",
      ({ callerId, callerName, signalData, videoCallId }) => {
        setCall({
          isReceivingCall: true,
          from: callerId,
          name: callerName,
          signal: signalData,
          callUrl: videoCallId,
        });
      }
    );
  }, [history]);

  const value = {
    userToCallName,
    callAccepted,
    callEnded,
    callUser,
    answerCall,
    leaveCall,
    stream,
    setStream,
    myVideo,
    otherVideo,
    call,
    connectToSocket,
    socket,
  };
  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
};
