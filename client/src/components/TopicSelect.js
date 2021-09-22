import { useDispatch, useSelector } from "react-redux";
import Video from "./Video";
import styles from "../styles/Board.module.scss";
import topicsData from "../topicsData";
import { updateUserTopic } from "../actions/userAction";

const TopicSelect = () => {
  const { currentUser } = useSelector((state) => state.users);
  const topics = topicsData();
  const dispatch = useDispatch();

  const setTopic = (topicName) => {
    dispatch(updateUserTopic(currentUser.id, topicName));
  };

  return (
    <div className={styles.topicSelect}>
      <div className={styles.userInfo}>
        <div>
          <h1>Welcome {currentUser && currentUser.username},</h1>
          <h3>What do you want to talk about today?</h3>
        </div>
        <div className={styles.displayVideo}>
          <Video />
        </div>
      </div>
      <div className={styles.topic}>
        {topics.map((topic) => (
          <div
            className={styles.topicBubble}
            key={topic.id}
            onClick={() => setTopic(topic.name)}
          >
            {topic.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopicSelect;
