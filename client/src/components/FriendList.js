import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFriend } from "../actions/friendAction";
import { useCall } from "../contexts/CallContext";
import { FaTimes, FaVideo } from "react-icons/fa";
import styles from "../styles/Friends.module.scss";

const FriendList = () => {
  const [loading, setLoading] = useState(false);
  const { callUser } = useCall();
  const { friendList } = useSelector((state) => state.friends);
  const { currentUser, allUsers } = useSelector((state) => state.users);

  const friendIds = friendList
    .filter((friend) => friend.isPending === false)
    .map((friend) => friend.senderId);

  const acceptedFriends = allUsers.filter((user) =>
    friendIds.includes(user.id)
  );

  const dispatch = useDispatch();

  const remove = (friend) => {
    setLoading(true);
    dispatch(removeFriend(currentUser.id, friend.id));
    return setLoading(false);
  };

  return (
    <>
      <h3>Friends List</h3>
      <div className={styles.friendList}>
        {acceptedFriends.length ? (
          acceptedFriends.map((acceptedFriend) => (
            <div key={acceptedFriend.id} className={styles.friendTile}>
              <h4>{acceptedFriend.username}</h4>
              <div className={styles.actionBtns}>
                <button
                  disabled={!acceptedFriend.isAvailable}
                  onClick={() =>
                    callUser(acceptedFriend.id, acceptedFriend.username)
                  }
                >
                  <FaVideo />
                </button>
                <button
                  disabled={loading}
                  onClick={() => remove(acceptedFriend)}
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Send requests to add friends</p>
        )}
      </div>
    </>
  );
};

export default FriendList;
