import { firestore } from "../firebase";

export const addUserDocument = (id, data) => async (dispatch) => {
  try {
    await firestore.collection("users").doc(id).set(data);
  } catch (err) {
    console.log(err.message);
    dispatch({
      type: "USER_ERROR",
      payload: err.message,
    });
  }
};

export const getUserDocuments = () => async (dispatch) => {
  try {
    const data = [];
    const users = await firestore.collection("users").get();
    if (users.empty) {
      dispatch({
        type: "USER_ERROR",
        payload: "No users found",
      });
    } else {
      users.forEach((user) => data.push({ id: user.id, ...user.data() }));
      dispatch({
        type: "GET_USERS",
        payload: data,
      });
    }
  } catch (err) {
    console.log(err.message);
    dispatch({
      type: "USER_ERROR",
      payload: err.message,
    });
  }
};

export const getCurrentUser = (id) => async (dispatch) => {
  try {
    const user = await firestore.collection("users").doc(id).get();
    if (!user.exists) {
      dispatch({
        type: "USER_ERROR",
        payload: "User not found",
      });
    } else {
      const data = { id, ...user.data() };
      dispatch({
        type: "GET_CURRENT_USER",
        payload: data,
      });
    }
  } catch (err) {
    console.log(err.message);
    dispatch({
      type: "USER_ERROR",
      payload: err.message,
    });
  }
};

export const updateUserStatus =
  ({ id, availabilityStatus }) =>
  async (dispatch) => {
    try {
      const userRef = firestore.collection("users").doc(id);
      await userRef.update({
        isAvailable: availabilityStatus,
      });
      if (availabilityStatus) window.location.reload();
    } catch (err) {
      console.log(err.message);
      dispatch({
        type: "USER_ERROR",
        payload: err.message,
      });
    }
  };

export const updateUserTopic = (id, topicName) => async (dispatch) => {
  try {
    const userRef = firestore.collection("users").doc(id);
    await userRef.update({
      topic: topicName,
    });
  } catch (err) {
    console.log(err.message);
    dispatch({
      type: "USER_ERROR",
      payload: err.message,
    });
  }
};
