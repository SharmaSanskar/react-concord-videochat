import { nanoid } from "nanoid";
import { arrayAdd, arrayRemove, firestore } from "../firebase";

export const getUserRooms = (id) => async (dispatch) => {
  try {
    const userRef = firestore.collection("users").doc(id);
    const userData = (await userRef.get()).data();
    const roomArr = userData.rooms;
    if (roomArr && roomArr.length) {
      const data = [];
      const rooms = await firestore
        .collection("rooms")
        .where("roomId", "in", roomArr)
        .get();
      rooms.forEach((room) => data.push(room.data()));
      dispatch({
        type: "GET_ROOMS",
        payload: data,
      });
    } else {
      dispatch({
        type: "NO_ROOMS",
      });
    }
  } catch (err) {
    console.log(err.message);
    dispatch({
      type: "ROOM_ERROR",
      payload: err.message,
    });
  }
};

export const getCurrentRoom = (id) => async (dispatch) => {
  try {
    const roomRef = firestore.collection("rooms").doc(id);
    const roomData = (await roomRef.get()).data();
    dispatch({
      type: "CURRENT_ROOM",
      payload: roomData,
    });
  } catch (err) {
    console.log(err.message);
    dispatch({
      type: "ROOM_ERROR",
      payload: err.message,
    });
  }
};

export const createNewRoom =
  (roomName, creatorId, creatorName) => async (dispatch) => {
    try {
      const id = nanoid(7);
      const data = {
        roomId: id,
        roomName: roomName,
        members: [{ id: creatorId, username: creatorName }],
      };
      await firestore.collection("rooms").doc(id).set(data);
      const userRef = firestore.collection("users").doc(creatorId);
      await userRef.update({
        rooms: arrayAdd(id),
      });
    } catch (err) {
      console.log(err.message);
      dispatch({
        type: "ROOM_ERROR",
        payload: err.message,
      });
    }
  };

export const deleteCurrentRoom = (id) => async (dispatch) => {
  try {
    const roomRef = firestore.collection("rooms").doc(id);
    const roomData = (await roomRef.get()).data();
    const memberList = roomData.members;
    memberList.forEach(async (member) => {
      const userRef = firestore.collection("users").doc(member.id);
      await userRef.update({
        rooms: arrayRemove(id),
      });
    });
    await roomRef.delete();
  } catch (err) {
    console.log(err.message);
    dispatch({
      type: "ROOM_ERROR",
      payload: err.message,
    });
  }
};

export const addRoomMember = (roomId, userObj) => async (dispatch) => {
  try {
    const roomRef = firestore.collection("rooms").doc(roomId);
    await roomRef.update({
      members: arrayAdd(userObj),
    });
    const userRef = firestore.collection("users").doc(userObj.id);
    await userRef.update({
      rooms: arrayAdd(roomId),
    });
  } catch (err) {
    console.log(err.message);
    dispatch({
      type: "ROOM_ERROR",
      payload: err.message,
    });
  }
};

export const removeRoomMember = (roomId, userObj) => async (dispatch) => {
  try {
    const roomRef = firestore.collection("rooms").doc(roomId);
    await roomRef.update({
      members: arrayRemove(userObj),
    });
    const userRef = firestore.collection("users").doc(userObj.id);
    await userRef.update({
      rooms: arrayRemove(roomId),
    });
  } catch (err) {
    console.log(err.message);
    dispatch({
      type: "ROOM_ERROR",
      payload: err.message,
    });
  }
};
