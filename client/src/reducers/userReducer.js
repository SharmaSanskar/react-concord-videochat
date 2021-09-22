const initState = {
  currentUser: null,
  allUsers: [],
  userError: null,
  userLoading: true,
};

const userReducer = (state = initState, action) => {
  switch (action.type) {
    case "GET_CURRENT_USER":
      return {
        ...state,
        currentUser: action.payload,
      };
    case "GET_USERS":
      return {
        ...state,
        userLoading: false,
        allUsers: action.payload,
      };
    case "USER_ERROR":
      return {
        ...state,
        userError: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
