import { combineReducers } from "redux";
import friendReducer from "./friendReducer";
import roomReducer from "./roomReducer";
import userReducer from "./userReducer";

const rootReducer = combineReducers({
  users: userReducer,
  friends: friendReducer,
  rooms: roomReducer,
});

export default rootReducer;
