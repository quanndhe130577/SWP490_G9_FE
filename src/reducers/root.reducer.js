import { combineReducers } from "redux";
import user from "./user/user";
import modals from "./modal/modals";
import purchase from "./purchase/purchase";
export default combineReducers({
  user,
  modals,
  purchase,
});
