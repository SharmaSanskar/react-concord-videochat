const initState = {
  friendList: [],
  requestList: [],
  friendError: null,
  friendLoading: true,
};

const friendReducer = (state = initState, action) => {
  switch (action.type) {
    case "GET_REQUESTS":
      return {
        ...state,
        requestList: action.payload,
      };
    case "GET_FRIENDS":
      return {
        ...state,
        friendLoading: false,
        friendList: action.payload,
      };
    case "NO_FRIENDS":
      return {
        ...state,
        friendLoading: false,
      };
    case "FRIEND_ERROR":
      return {
        ...state,
        friendError: action.payload,
      };
    default:
      return state;
  }
};

export default friendReducer;
