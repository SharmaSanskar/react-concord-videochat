import { useEffect, useRef, useState } from "react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import styles from "../styles/VideoCall.module.scss";

const RoomVideo = ({ peer }) => {
  const vidRef = useRef();
  const [vidAvailable, setVidAvailable] = useState(false);
  const [isMute, setIsMute] = useState(true);

  useEffect(() => {
    peer.on("stream", (currentStream) => {
      if (vidRef.current) {
        vidRef.current.srcObject = currentStream;
        setVidAvailable(true);
      }
    });
  }, [peer]);

  return (
    <div
      className={styles.otherVideo}
      onDoubleClick={() => setIsMute((prev) => !prev)}
    >
      {!vidAvailable && <div className={styles.noVideo}>No video</div>}
      <video playsInline muted={isMute} autoPlay ref={vidRef} />

      <div className={styles.icon}>
        {isMute ? <FaMicrophoneSlash /> : <FaMicrophone />}
      </div>
    </div>
  );
};

export default RoomVideo;
