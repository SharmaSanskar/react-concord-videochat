import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCall } from "../contexts/CallContext";
import { useDispatch, useSelector } from "react-redux";
import {
  getCurrentUser,
  getUserDocuments,
  updateUserStatus,
  updateUserTopic,
} from "../actions/userAction";
import { firestore } from "../firebase";
import styles from "../styles/Dashboard.module.scss";
import Friends from "./Friends";
import Notification from "./Notification";
import Rooms from "./Rooms";
import Room from "./Room";
import Board from "./Board";
import { useRoomCall } from "../contexts/RoomCallContext";

const Dashboard = () => {
  const [error, setError] = useState("");
  const { logout, loggedUser } = useAuth();
  const { currentRoom } = useSelector((state) => state.rooms);
  const { call, callAccepted } = useCall();
  const { roomCall, roomCallAccepted } = useRoomCall();
  const dispatch = useDispatch();
  const history = useHistory();

  // window.addEventListener("beforeunload", async () => {
  //   await handleLogout();
  // });

  const handleLogout = async () => {
    setError("");
    try {
      const uid = loggedUser.uid;
      dispatch(
        updateUserStatus({
          id: uid,
          availabilityStatus: false,
        })
      );
      dispatch(updateUserTopic(uid, ""));
      history.push("/login");
      setTimeout(() => logout(), 1000);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const unsub = firestore
      .collection("users")
      .doc(loggedUser.uid)
      .onSnapshot(() => {
        dispatch(getCurrentUser(loggedUser.uid));
      });

    return () => unsub();
  }, [dispatch, loggedUser]);

  useEffect(() => {
    const unsub = firestore.collection("users").onSnapshot(() => {
      dispatch(getUserDocuments());
    });
    return () => unsub();
  }, [dispatch]);

  return (
    <main>
      {(call.isReceivingCall && !callAccepted) ||
      (roomCall.incoming && !roomCallAccepted) ? (
        <Notification isRoomCall={roomCall.incoming} />
      ) : (
        <div className={styles.glass}>
          <section className={styles.rooms}>
            <div className={styles.logout}>
              <button onClick={handleLogout}>Logout</button>
              {error && <div className="error">{error}</div>}
            </div>
            <Rooms />
          </section>
          <section className={styles.board}>
            {currentRoom ? <Room /> : <Board />}
          </section>
          <section className={styles.friends}>
            <Friends />
          </section>
        </div>
      )}
    </main>
  );
};

export default Dashboard;
