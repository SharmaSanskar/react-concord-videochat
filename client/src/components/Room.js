import { useEffect, useState } from "react";
import { FaArrowLeft, FaTimes } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteCurrentRoom,
  getCurrentRoom,
  removeRoomMember,
} from "../actions/roomAction";
import { useRoomCall } from "../contexts/RoomCallContext";
import { firestore } from "../firebase";
import styles from "../styles/Room.module.scss";
import AddModal from "./AddModal";

const Room = () => {
  const [addModal, setAddModal] = useState(false);
  const dispatch = useDispatch();
  const { startRoomCall } = useRoomCall();

  const { currentRoom } = useSelector((state) => state.rooms);
  const { currentUser } = useSelector((state) => state.users);

  // const room = userRooms.filter((room) => room.roomId === currentRoom)[0];

  const removeMember = (memberId, memberName) => {
    if (currentRoom.members.length <= 1) {
      deleteRoom();
    } else {
      const roomId = currentRoom.roomId;
      const newMember = {
        id: memberId,
        username: memberName,
      };
      if (memberId === currentUser.id) {
        resetRoom();
      }
      dispatch(removeRoomMember(roomId, newMember));
    }
  };

  const deleteRoom = () => {
    resetRoom();
    dispatch(deleteCurrentRoom(currentRoom.roomId));
  };

  const resetRoom = () => {
    dispatch({
      type: "CURRENT_ROOM",
      payload: null,
    });
  };

  const startCall = () => {
    if (currentRoom.members <= 1) {
      return;
    }
  };

  useEffect(() => {
    const unsub = firestore
      .collection("rooms")
      .doc(currentRoom.roomId)
      .onSnapshot(() => {
        dispatch(getCurrentRoom(currentRoom.roomId));
      });

    return () => unsub();
  }, [dispatch, currentRoom.roomId]);

  return (
    <div className={styles.room}>
      <AddModal
        members={currentRoom.members}
        addModal={addModal}
        setAddModal={setAddModal}
        roomId={currentRoom.roomId}
      />
      <button className={styles.backBtn} onClick={() => resetRoom()}>
        <FaArrowLeft /> <span>Back to Dashboard</span>
      </button>
      <div className={styles.roomInfo}>
        <div>
          <p>{currentRoom.roomId}</p>
          <h1>{currentRoom.roomName}</h1>
        </div>
        <div className={styles.roomActions}>
          {currentRoom.members.length < 4 ? (
            <button onClick={() => setAddModal(true)}>Add Member</button>
          ) : (
            <button disabled>Room full</button>
          )}

          <button onClick={() => deleteRoom()}>Delete Room</button>
        </div>
      </div>
      {currentRoom.members.map((member) => (
        <div key={member.id} className={styles.memberTile}>
          <h4>{member.username}</h4>
          <button onClick={() => removeMember(member.id, member.username)}>
            {member.id === currentUser.id ? "Leave" : <FaTimes />}
          </button>
        </div>
      ))}
      <button
        disabled={currentRoom.members.length <= 1}
        onClick={() =>
          startRoomCall(
            currentRoom.roomId,
            currentRoom.roomName,
            currentUser.id,
            currentRoom.members
          )
        }
        className={styles.roomCall}
      >
        Room Call
      </button>
    </div>
  );
};

export default Room;
