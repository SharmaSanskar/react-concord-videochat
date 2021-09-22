import { arrayAdd, arrayRemove, firestore } from "../firebase";

export const sendFriendRequest =
  (senderId, receiverId, data) => async (dispatch) => {
    try {
      // Add to sender
      let senderDoc = await firestore.collection("friends").doc(senderId).get();
      if (senderDoc && senderDoc.exists) {
        await senderDoc.ref.update({
          requestList: arrayAdd(receiverId),
        });
      } else {
        const senderData = {
          friendList: [],
          requestList: [receiverId],
        };
        await firestore.collection("friends").doc(senderId).set(senderData);
      }
      // Add to receiver
      let receiverDoc = await firestore
        .collection("friends")
        .doc(receiverId)
        .get();
      if (receiverDoc && receiverDoc.exists) {
        await receiverDoc.ref.update({
          friendList: arrayAdd(data),
        });
      } else {
        const receiverData = {
          friendList: [data],
          requestList: [],
        };
        await firestore.collection("friends").doc(receiverId).set(receiverData);
      }
    } catch (err) {
      console.log(err.message);
      dispatch({
        type: "FRIEND_ERROR",
        payload: err.message,
      });
    }
  };

export const getUserFriends = (userId) => async (dispatch) => {
  try {
    const friendDoc = await firestore.collection("friends").doc(userId).get();
    if (friendDoc && friendDoc.exists) {
      const data = await friendDoc.get("friendList");
      dispatch({
        type: "GET_FRIENDS",
        payload: data,
      });
    } else {
      dispatch({
        type: "NO_FRIENDS",
      });
    }
  } catch (err) {
    console.log(err.message);
    dispatch({
      type: "FRIEND_ERROR",
      payload: err.message,
    });
  }
};

export const getUserRequests = (userId) => async (dispatch) => {
  try {
    const data = [];
    const friendDoc = await firestore.collection("friends").doc(userId).get();
    if (friendDoc && friendDoc.exists) {
      await friendDoc
        .get("requestList")
        .forEach((request) => data.push(...data, request));
      dispatch({
        type: "GET_REQUESTS",
        payload: data,
      });
    }
  } catch (err) {
    console.log(err.message);
    dispatch({
      type: "FRIEND_ERROR",
      payload: err.message,
    });
  }
};

export const acceptFriendRequest =
  (userId, senderId, data) => async (dispatch) => {
    try {
      // Update current user friend list
      let friendDoc = await firestore.collection("friends").doc(userId).get();
      const [oldObj] = await friendDoc
        .get("friendList")
        .filter((friend) => friend.senderId === senderId);
      const newObj = { ...oldObj, isPending: false };
      const userRef = firestore.collection("friends").doc(userId);
      await userRef.update({
        friendList: arrayRemove(oldObj),
      });
      await userRef.update({
        friendList: arrayAdd(newObj),
      });
      // Add in sender friend list
      const senderRef = firestore.collection("friends").doc(senderId);
      await senderRef.update({
        friendList: arrayAdd(data),
        requestList: arrayRemove(userId),
      });
    } catch (err) {
      console.log(err.message);
      dispatch({
        type: "FRIEND_ERROR",
        payload: err.message,
      });
    }
  };

export const declineFriendRequest = (userId, senderId) => async (dispatch) => {
  try {
    // Remove from current user friend list
    let friendDoc = await firestore.collection("friends").doc(userId).get();
    const [friendObj] = await friendDoc
      .get("friendList")
      .filter((friend) => friend.senderId === senderId);
    const userRef = firestore.collection("friends").doc(userId);
    await userRef.update({
      friendList: arrayRemove(friendObj),
    });
    // Remove from sender request list
    const senderRef = firestore.collection("friends").doc(senderId);
    await senderRef.update({
      requestList: arrayRemove(userId),
    });
  } catch (err) {
    console.log(err.message);
    dispatch({
      type: "FRIEND_ERROR",
      payload: err.message,
    });
  }
};

export const removeFriend = (userId, senderId) => async (dispatch) => {
  try {
    // Remove sender from current user friend list
    let userDoc = await firestore.collection("friends").doc(userId).get();
    const [senderObj] = await userDoc
      .get("friendList")
      .filter((friend) => friend.senderId === senderId);
    const userRef = firestore.collection("friends").doc(userId);
    await userRef.update({
      friendList: arrayRemove(senderObj),
    });
    // Remove current user from sender friend list
    let senderDoc = await firestore.collection("friends").doc(senderId).get();
    const [userObj] = await senderDoc
      .get("friendList")
      .filter((friend) => friend.senderId === userId);
    const senderRef = firestore.collection("friends").doc(senderId);
    await senderRef.update({
      friendList: arrayRemove(userObj),
    });
  } catch (err) {
    console.log(err.message);
    dispatch({
      type: "FRIEND_ERROR",
      payload: err.message,
    });
  }
};
