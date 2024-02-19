import { combineReducers } from 'redux';

import AuthFunctionReducer from './AuthFunctionReducer.js';

const allReducers = combineReducers({
  auth_function:AuthFunctionReducer,
  
});

export default allReducers;