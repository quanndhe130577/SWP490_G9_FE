import { createStore } from "redux";
import rootReducer from "./reducers/root.reducer";
const store = createStore(rootReducer);
const configureStore = () => {
  return store;
};
export default configureStore;
