import { combineReducers } from "redux";
import user from "./user/user";
import purchase from "./purchase/purchase";
export default combineReducers({
  user,
  purchase,
});
