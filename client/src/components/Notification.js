import { useCall } from "../contexts/CallContext";
import { useRoomCall } from "../contexts/RoomCallContext";
import styles from "../styles/Notification.module.scss";

const Notification = ({ isRoomCall }) => {
  const { call, answerCall, leaveCall } = useCall();
  const { roomCall, setRoomCall, answerRoomCall } = useRoomCall();
  return (
    <>
      {isRoomCall ? (
        <div className={styles.notification}>
          <h1>{roomCall.roomName} room call</h1>
          <div className={styles.btns}>
            <button onClick={() => answerRoomCall()}>Answer</button>
            <button onClick={() => setRoomCall({})}>Decline</button>
          </div>
        </div>
      ) : (
        <div className={styles.notification}>
          <h1>{call.name} is calling</h1>
          <div className={styles.btns}>
            <button onClick={() => answerCall()}>Answer</button>
            <button onClick={() => leaveCall(call.from)}>Decline</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Notification;
