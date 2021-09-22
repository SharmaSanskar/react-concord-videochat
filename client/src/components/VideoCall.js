import { useCall } from "../contexts/CallContext";
import { AES, enc } from "crypto-js";
import styles from "../styles/VideoCall.module.scss";
import Video from "./Video";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { useEffect, useState } from "react";

const VideoCall = () => {
  const { call, leaveCall, callAccepted, otherVideo, userToCallName } =
    useCall();
  const url = window.location.pathname;
  const [isMute, setIsMute] = useState(true);

  const endCall = () => {
    const bytes = AES.decrypt(url.slice(11), "secret");
    const urlData = JSON.parse(bytes.toString(enc.Utf8));
    const endId = call.isReceivingCall ? urlData.caller : urlData.receiver;
    leaveCall(endId);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => endCall(), []);

  return (
    <>
      {!callAccepted ? (
        <div className={styles.waitScreen}>
          <h1>Calling {userToCallName} . . .</h1>
        </div>
      ) : (
        <div className={styles.videoScreen}>
          <div className={styles.videoContainer}>
            <div className={styles.myVideo}>
              <Video />
            </div>
            <div
              onDoubleClick={() => setIsMute((prev) => !prev)}
              className={styles.otherVideo}
            >
              {!otherVideo.current?.srcObject && (
                <div className={styles.noVideo}>No video</div>
              )}
              <video playsInline muted={isMute} ref={otherVideo} autoPlay />
              <div className={styles.icon}>
                {isMute ? <FaMicrophoneSlash /> : <FaMicrophone />}
              </div>
            </div>
          </div>
          <div className={styles.actionBar}>
            <button onClick={() => endCall()}>End Call</button>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoCall;
