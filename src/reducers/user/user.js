const initialState = {
  token: "",
  user: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case "SET_USER_INFO":
      return {
        ...state,
        token: action.token,
        user: action.user,
      };
    case "SET_DATA":
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
