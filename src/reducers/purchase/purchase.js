const initialState = {
  currentPurchase: {},
  purchase: [],
};

export default function user(state = initialState, action) {
  switch (action.type) {
    case "SET_PURCHASE":
      return {
        ...state,
        currentPurchase: action.currentPurchase,
        purchase: action.purchase,
      };
    default:
      return state;
  }
}
