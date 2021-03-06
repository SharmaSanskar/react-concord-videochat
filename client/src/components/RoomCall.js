import { useEffect } from "react";
import { useRoomCall } from "../contexts/RoomCallContext";
import styles from "../styles/VideoCall.module.scss";
import RoomVideo from "./RoomVideo";
import Video from "./Video";

const RoomCall = () => {
  const { peersRef, endRoomCall, roomCall } = useRoomCall();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => endRoomCall(roomCall.roomId), []);

  return (
    <div className={styles.videoScreen}>
      <div className={styles.roomContainer}>
        <div className={styles.myVideo}>
          <Video />
        </div>
        {peersRef.current.map((peer) => (
          <RoomVideo key={peer.peerId} peer={peer.peer} />
        ))}
      </div>
      <div className={styles.actionBar}>
        <button onClick={() => endRoomCall(roomCall.roomId)}>End Call</button>
      </div>
    </div>
  );
};

export default RoomCall;
