import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { firestore } from "../firebase";
import { getUserFriends } from "../actions/friendAction";
import { useAuth } from "../contexts/AuthContext";
import PendingList from "./PendingList";
import FriendList from "./FriendList";
import styles from "../styles/Friends.module.scss";

const Friends = () => {
  const { loggedUser } = useAuth();
  const { friendLoading } = useSelector((state) => state.friends);

  const dispatch = useDispatch();
  useEffect(() => {
    const unsub = firestore
      .collection("friends")
      .doc(loggedUser.uid)
      .onSnapshot(() => {
        dispatch(getUserFriends(loggedUser.uid));
      });

    return () => unsub();
  }, [dispatch, loggedUser]);
  return (
    <div className={styles.friends}>
      <h2>Friends</h2>
      {friendLoading ? (
        <h3>Loading friends..</h3>
      ) : (
        <div>
          <PendingList />
          <FriendList />
        </div>
      )}
    </div>
  );
};

export default Friends;
