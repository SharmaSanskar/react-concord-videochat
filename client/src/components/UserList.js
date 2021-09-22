import { useDispatch, useSelector } from "react-redux";
import { updateUserTopic } from "../actions/userAction";
import UserTile from "./UserTile";
import styles from "../styles/Board.module.scss";

const UserList = () => {
  const { currentUser, allUsers } = useSelector((state) => state.users);
  const { friendList } = useSelector((state) => state.friends);
  const dispatch = useDispatch();

  const acceptedFriends = friendList
    .filter((friend) => friend.isPending === false)
    .map((acceptedFriend) => acceptedFriend.senderId);

  const resetTopic = () => {
    dispatch(updateUserTopic(currentUser.id, ""));
  };

  return (
    <div className={styles.userList}>
      <div className={styles.topicInfo}>
        <h2>
          People interested in <span>{currentUser.topic}</span>
        </h2>
        <button className={styles.topicBtn} onClick={() => resetTopic()}>
          Change topic
        </button>
      </div>
      <div className={styles.allUsersList}>
        {allUsers
          .filter(
            (user) =>
              user.id !== currentUser.id &&
              !acceptedFriends.includes(user.id) &&
              user.topic === currentUser.topic
          )
          .map((filteredUser) => (
            <UserTile key={filteredUser.id} user={filteredUser} />
          ))}
      </div>
    </div>
  );
};

export default UserList;
