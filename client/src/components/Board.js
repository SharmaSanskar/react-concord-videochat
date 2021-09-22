import { useSelector } from "react-redux";
import UserList from "./UserList";
import TopicSelect from "./TopicSelect";

const Board = () => {
  const { userLoading, currentUser } = useSelector((state) => state.users);

  return (
    <>
      {userLoading ? (
        <h2>Loading...</h2>
      ) : currentUser.topic === "" ? (
        <TopicSelect />
      ) : (
        <UserList />
      )}
    </>
  );
};

export default Board;
