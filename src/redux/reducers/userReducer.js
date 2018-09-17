import actionTypes from '../actions/actionTypes';

const userReducer = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_USER:
      return {
        isAuthenticated: !!action.payload.username,
        detail: action.payload,
      };
    case actionTypes.UNSET_CURRENT_USER:
      return {};
    default:
      return state;
  }
};
export default userReducer;
