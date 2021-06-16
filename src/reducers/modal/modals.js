import _ from "lodash";
const initialState = [];
export default function modal(state = initialState, action) {
  let tmp = _.clone(state);
  switch (action.type) {
    case "PUSH_MODAL":
      action.data.show = true;
      action.data.id = _.uniqueId();
      tmp.push(action.data);
      return tmp;
    case "POP_MODAL":
      for (let i = 0; i < tmp.length; i++) {
        if (tmp[i].id === action.data.id) {
          tmp[i].show = false;
          tmp.splice(i, 1);
        }
      }
      return tmp;
    case "HIDE_MODAL":
      for (let i = 0; i < tmp.length; i++) {
        if (tmp[i].id === action.data.id) {
          tmp[i].show = false;
        }
      }
      return tmp;
    default:
      return state;
  }
}
