const defaultState =  { bid: {}, ask: {} };

const orderBookReducer = (state = defaultState, action) => {
  let newState = { ...state };
  switch (action.type) {
    case 'UPDATE_BID': {
      newState.bid[action.payload.price] = action.payload;
      return newState;
    }
    case 'UPDATE_ASK': {
      newState.ask[action.payload.price] = action.payload;
      return newState;
    }
    case 'DELETE_BID': {
      delete newState.bid[action.payload.price];
      return newState;
    }
    case 'DELETE_ASK':
      delete newState.ask[action.payload.price];
      return newState;
    default:
      return state;
  }
}

export default orderBookReducer;
