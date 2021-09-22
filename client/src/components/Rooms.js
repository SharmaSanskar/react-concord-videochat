import { useRef, useState } from "react";
import ReactModal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { createNewRoom } from "../actions/roomAction";
import RoomList from "./RoomList";
import styles from "../styles/Rooms.module.scss";

const Rooms = () => {
  const [createModal, setCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef();
  const { currentUser } = useSelector((state) => state.users);
  const { roomLoading } = useSelector((state) => state.rooms);

  const dispatch = useDispatch();

  const createRoom = () => {
    if (!inputRef.current.value) {
      setError("Please provide a room name");
    } else {
      setLoading(true);
      dispatch(
        createNewRoom(
          inputRef.current.value,
          currentUser.id,
          currentUser.username
        )
      );
      // dispatch(getCurrentUser(currentUser.id));
      setError("");
      setLoading(false);
      setCreateModal(false);
    }
  };
  return (
    <>
      <h2>Rooms</h2>
      <button className={styles.createBtn} onClick={() => setCreateModal(true)}>
        Create Room
      </button>
      <ReactModal
        isOpen={createModal}
        onRequestClose={() => setCreateModal(false)}
        overlayClassName="overlay"
        className={styles.popup}
      >
        <h3>Create New Room</h3>
        <h4>Enter room name</h4>
        <input ref={inputRef} type="text" />
        {error && <p>{error}</p>}
        <button disabled={loading} onClick={() => createRoom()}>
          Create
        </button>
      </ReactModal>
      {!currentUser && roomLoading ? <h3>Loading Rooms..</h3> : <RoomList />}
    </>
  );
};

export default Rooms;
