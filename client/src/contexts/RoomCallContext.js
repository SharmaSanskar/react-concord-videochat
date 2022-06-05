import { createContext, useContext, useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { useDispatch, useSelector } from "react-redux";
import { useCall } from "./CallContext";
import { useHistory } from "react-router";
import { useAuth } from "./AuthContext";
import { updateUserStatus } from "../actions/userAction";

const RoomCallContext = createContext();

export const useRoomCall = () => {
  return useContext(RoomCallContext);
};

export const RoomCallProvider = ({ children }) => {
  // Room Call Start
  const { socket } = useCall();
  const { currentUser } = useSelector((state) => state.users);
  const { loggedUser } = useAuth();
  const [roomCall, setRoomCall] = useState({});
  const [roomCallAccepted, setRoomCallAccepted] = useState(false);

  const [peers, setPeers] = useState([]);
  const peersRef = useRef([]);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        socket.on("all members", (members) => {
          const peers = [];
          members.forEach((memberId) => {
            const peer = createMemberPeer(memberId, loggedUser.uid, stream);
            peersRef.current.push({
              peerId: memberId,
              peer,
            });
            peers.push(peer);
          });
          setPeers(peers);
        });

        socket.on("new member", ({ newMemberId, signalData }) => {
          const peer = addMemberPeer(
            signalData,
            newMemberId,
            stream,
            loggedUser.uid
          );

          // Add new member in local peers array
          peersRef.current.push({
            peerId: newMemberId,
            peer,
          });

          setPeers((prevState) => [...prevState, peer]);
        });
      });

    socket.on("receiving returned signal", ({ memberId, signalData }) => {
      const memberSignaling = peersRef.current.find(
        (p) => p.peerId === memberId
      );

      memberSignaling.peer.signal(signalData);
    });

    socket.on("room call incoming", ({ roomId, roomName }) => {
      setRoomCall({
        roomId,
        roomName,
        incoming: true,
      });
    });

    socket.on("room call over", () => {
      history.push("/");
      setRoomCallAccepted(true);
      setRoomCall({});
      dispatch(
        updateUserStatus({
          id: loggedUser.uid,
          availabilityStatus: true,
        })
      );
      peersRef.current.forEach((peerObj) => {
        if (peerObj) {
          peerObj.peer.destroy();
        }
      });
      peersRef.current = [];
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startRoomCall = (roomId, roomName, initiatorId, members) => {
    socket.emit("join room", { roomId, memberId: initiatorId });
    const filteredMembers = members
      .filter((member) => member.id !== initiatorId)
      .map((member) => member.id);
    filteredMembers.forEach((memberId) => {
      socket.emit("invite", { memberToCall: memberId, roomId, roomName });
    });
    setRoomCall({
      roomId,
      roomName,
      incoming: false,
    });
    dispatch(
      updateUserStatus({
        id: initiatorId,
        availabilityStatus: false,
      })
    );

    history.push(`/roomcall/${roomId}`);
  };

  const answerRoomCall = () => {
    setRoomCallAccepted(true);
    socket.emit("join room", {
      roomId: roomCall.roomId,
      memberId: currentUser.id,
    });
    dispatch(
      updateUserStatus({
        id: loggedUser.uid,
        availabilityStatus: false,
      })
    );
    history.push(`/roomcall/${roomCall.roomId}`);
  };

  const createMemberPeer = (memberToSignal, newMemberId, stream) => {
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

    // Immediately sending signal to each member that new member has joined
    peer.on("signal", (signalData) => {
      socket.emit("sending signal to member", {
        memberToSignal,
        newMemberId,
        signalData,
      });
    });

    return peer;
  };

  const addMemberPeer = (incomingSignal, newMemberId, stream, memberId) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    // Sending each member data to new member
    peer.on("signal", (signalData) => {
      socket.emit("returning to new member", {
        signalData,
        newMemberId,
        memberId,
      });
    });

    peer.signal(incomingSignal);

    return peer;
  };

  const endRoomCall = (roomId) => {
    socket.emit("room call ended", roomId);
  };

  // Room Call End
  const value = {
    roomCall,
    setRoomCall,
    roomCallAccepted,
    startRoomCall,
    answerRoomCall,
    peersRef,
    endRoomCall,
    peers,
  };
  return (
    <RoomCallContext.Provider value={value}>
      {children}
    </RoomCallContext.Provider>
  );
};
