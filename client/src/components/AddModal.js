import { FaPlus } from "react-icons/fa";
import ReactModal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { addRoomMember } from "../actions/roomAction";
import styles from "../styles/Room.module.scss";

const AddModal = ({ addModal, setAddModal, members, roomId }) => {
  const { friendList } = useSelector((state) => state.friends);
  const dispatch = useDispatch();

  const memberIds = members.map((member) => member.id);
  const eligibleMembers = friendList.filter(
    (friend) =>
      friend.isPending === false && !memberIds.includes(friend.senderId)
  );

  const addMember = (memberId, memberName) => {
    const newMember = {
      id: memberId,
      username: memberName,
    };

    dispatch(addRoomMember(roomId, newMember));
    setAddModal(false);
  };

  return (
    <ReactModal
      isOpen={addModal}
      onRequestClose={() => setAddModal(false)}
      overlayClassName="overlay"
      className={styles.popup}
    >
      <h2>Add Room Member</h2>
      {eligibleMembers.length ? (
        eligibleMembers.map((friend) => (
          <div key={friend.senderId} className={styles.friendTile}>
            <h4>{friend.senderName}</h4>
            <button
              onClick={() => addMember(friend.senderId, friend.senderName)}
            >
              <FaPlus />
            </button>
          </div>
        ))
      ) : (
        <p>No friends available to add as member</p>
      )}
    </ReactModal>
  );
};

export default AddModal;
