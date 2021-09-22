const initState = {
  currentRoom: null,
  userRooms: [],
  roomError: null,
  roomLoading: true,
};

const roomReducer = (state = initState, action) => {
  switch (action.type) {
    case "GET_ROOMS":
      return {
        ...state,
        roomLoading: false,
        userRooms: action.payload,
      };
    case "NO_ROOMS":
      return {
        ...state,
        roomLoading: false,
        userRooms: [],
      };
    case "CURRENT_ROOM":
      return {
        ...state,
        currentRoom: action.payload,
      };
    case "ROOM_ERROR":
      return {
        ...state,
        roomError: action.payload,
      };
    default:
      return state;
  }
};

export default roomReducer;
