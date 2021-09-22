import { useEffect, useRef, useState } from "react";
import styles from "../styles/VideoCall.module.scss";

const RoomVideo = ({ peer, isMute }) => {
  const vidRef = useRef();
  const [vidAvailable, setVidAvailable] = useState(false);

  useEffect(() => {
    peer.on("stream", (currentStream) => {
      if (vidRef.current) {
        vidRef.current.srcObject = currentStream;
        setVidAvailable(true);
      }
    });
  }, [peer]);

  return (
    <>
      {!vidAvailable && <div className={styles.noVideo}>No video</div>}
      <video playsInline muted={isMute} autoPlay ref={vidRef} />
    </>
  );
};

export default RoomVideo;
