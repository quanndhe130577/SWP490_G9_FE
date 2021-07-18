const initialState = {
  currentPurchase: {},
  purchase: [],
  currentTransaction: {},
  transaction: [],
};

export default function user(state = initialState, action) {
  switch (action.type) {
    case "SET_PURCHASE":
      return {
        ...state,
        currentPurchase: action.currentPurchase,
        purchase: action.purchase,
      };
    case "SET_TRANSACTION":
      return {
        ...state,
        currentTransaction: action.currentTransaction,
        transaction: action.transaction,
      };
    default:
      return state;
  }
}
