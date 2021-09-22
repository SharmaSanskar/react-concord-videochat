import { useEffect } from "react";
import { useCall } from "../contexts/CallContext";
import styles from "../styles/VideoCall.module.scss";
import { useAuth } from "../contexts/AuthContext";

const Video = () => {
  const { setStream, stream, myVideo, connectToSocket } = useCall();
  const { loggedUser } = useAuth();

  useEffect(() => {
    connectToSocket(loggedUser.uid);
  }, [loggedUser, connectToSocket]);

  useEffect(() => {
    const getAudioVideo = async () => {
      try {
        const currentStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(currentStream);

        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      } catch (err) {
        console.log(err);
      }
    };
    getAudioVideo();
  }, [setStream, myVideo]);

  return (
    <>
      {stream ? (
        <video playsInline muted ref={myVideo} autoPlay />
      ) : (
        <div className={styles.noVideo}>No video</div>
      )}
    </>
  );
};

export default Video;
