import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { firestore } from "../firebase";
import { getUserRequests } from "../actions/friendAction";
import { useAuth } from "../contexts/AuthContext";
import { sendFriendRequest } from "../actions/friendAction";
import { timestamp } from "../firebase";
import styles from "../styles/User.module.scss";
import { useCall } from "../contexts/CallContext";

const UserTile = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.users);
  const { requestList } = useSelector((state) => state.friends);
  const { callUser } = useCall();

  const { loggedUser } = useAuth();

  useEffect(() => {
    const unsub = firestore
      .collection("friends")
      .doc(loggedUser.uid)
      .onSnapshot(() => {
        dispatch(getUserRequests(loggedUser.uid));
      });

    return () => unsub();
  }, [dispatch, loggedUser]);

  const sendRequest = (friend) => {
    setLoading(true);
    const newRequest = {
      senderId: currentUser.id,
      senderName: currentUser.username,
      isPending: true,
      createdAt: timestamp(),
    };

    dispatch(sendFriendRequest(currentUser.id, friend.id, newRequest));
    setLoading(false);
  };
  return (
    <div className={styles.userTile}>
      <div className={styles.userInfo}>
        <h4>{user.username}</h4>
        <p>{user.topic}</p>
      </div>
      <div className={styles.userActions}>
        {requestList.includes(user.id) ? (
          <button disabled={true}>Request sent</button>
        ) : (
          <button disabled={loading} onClick={() => sendRequest(user)}>
            Add Friend
          </button>
        )}
        <button
          disabled={!user.isAvailable}
          onClick={() => callUser(user.id, user.username)}
        >
          Video Call
        </button>
      </div>
    </div>
  );
};

export default UserTile;
