import { useEffect, useState } from "react";
import { useRoomCall } from "../contexts/RoomCallContext";
import styles from "../styles/VideoCall.module.scss";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import RoomVideo from "./RoomVideo";
import Video from "./Video";

const RoomCall = () => {
  const { peersRef, endRoomCall, roomCall } = useRoomCall();
  const [isMute, setIsMute] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => endRoomCall(roomCall.roomId), []);

  return (
    <div className={styles.videoScreen}>
      <div className={styles.roomContainer}>
        <div className={styles.myVideo}>
          <Video />
        </div>
        {peersRef.current.map((peer) => (
          <div
            key={peer.peerId}
            className={styles.otherVideo}
            onDoubleClick={() => setIsMute((prev) => !prev)}
          >
            <RoomVideo peer={peer.peer} isMute={isMute} />
            <div className={styles.icon}>
              {isMute ? <FaMicrophoneSlash /> : <FaMicrophone />}
            </div>
          </div>
        ))}
      </div>
      <div className={styles.actionBar}>
        <button onClick={() => endRoomCall(roomCall.roomId)}>End Call</button>
      </div>
    </div>
  );
};

export default RoomCall;
