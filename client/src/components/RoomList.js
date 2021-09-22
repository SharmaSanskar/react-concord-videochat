import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { firestore } from "../firebase";
import { getUserRooms, getCurrentRoom } from "../actions/roomAction";
import styles from "../styles/Rooms.module.scss";

const RoomList = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.users);
  const { userRooms, currentRoom } = useSelector((state) => state.rooms);

  const setRoom = (roomId) => {
    dispatch(getCurrentRoom(roomId));
  };

  useEffect(() => {
    const unsub = firestore
      .collection("users")
      .doc(currentUser.id)
      .onSnapshot(() => {
        dispatch(getUserRooms(currentUser.id));
      });

    return () => unsub();
  }, [dispatch, currentUser]);
  return (
    <>
      <h3>RoomList</h3>
      <div className={styles.roomList}>
        {userRooms.length ? (
          userRooms.map((room) => (
            <div
              onClick={() => setRoom(room.roomId)}
              key={room.roomId}
              className={
                room.roomId !== currentRoom?.roomId
                  ? styles.roomTile
                  : styles.activeTile
              }
            >
              <h5>{room.roomId}</h5>
              <h4>{room.roomName}</h4>
              <h5>{room.members.length} members</h5>
            </div>
          ))
        ) : (
          <p>You have no rooms</p>
        )}
      </div>
    </>
  );
};

export default RoomList;
