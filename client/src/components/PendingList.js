import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  acceptFriendRequest,
  declineFriendRequest,
} from "../actions/friendAction";
import { timestamp } from "../firebase";
import styles from "../styles/Friends.module.scss";
import { FaTimes, FaCheck } from "react-icons/fa";

const PendingList = () => {
  const [loading, setLoading] = useState(false);
  const { friendList } = useSelector((state) => state.friends);
  const { currentUser } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const pendingFriends = friendList.filter(
    (friend) => friend.isPending === true
  );

  const acceptRequest = (friend) => {
    setLoading(true);
    const userData = {
      senderId: currentUser.id,
      senderName: currentUser.username,
      isPending: false,
      createdAt: timestamp(),
    };

    dispatch(acceptFriendRequest(currentUser.id, friend.senderId, userData));
    return setLoading(false);
  };

  const declineRequest = (friend) => {
    setLoading(true);
    dispatch(declineFriendRequest(currentUser.id, friend.senderId));
    return setLoading(false);
  };

  return (
    <>
      <h3>Pending List</h3>
      <div className={styles.pendingList}>
        {pendingFriends.length ? (
          pendingFriends.map((pendingFriend) => (
            <div key={pendingFriend.senderId} className={styles.friendTile}>
              <h4>{pendingFriend.senderName}</h4>
              <div className={styles.actionBtns}>
                <button
                  disabled={loading}
                  onClick={() => acceptRequest(pendingFriend)}
                >
                  <FaCheck />
                </button>
                <button
                  disabled={loading}
                  onClick={() => declineRequest(pendingFriend)}
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No pending requests</p>
        )}
      </div>
    </>
  );
};

export default PendingList;
