import * as Actions from '../actions/ActionTypes'
const AuthFunctionReducer = (state = { vendor_profile_picture:undefined }, action) => {

    switch (action.type) {
        case Actions.UPDATE_VENDOR_PROFILE_PICTURE:
            return Object.assign({}, state, {
                vendor_profile_picture: action.data
            });
        default:
            return state;
    }
}

export default AuthFunctionReducer;


