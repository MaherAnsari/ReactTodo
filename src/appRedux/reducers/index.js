// import {combineReducers} from 'redux';
// import User from './UserReducers';

// const rootReducer = combineReducers({
// 	User
// });

// export default rootReducer;

import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
// import Settings from "./Settings";
import Auth from "./Auth";
import Todo from "./todo";
// import Contact from "./Contact";
// import Common from "./Common";
// import AddUser from "./AddUser";


const rootReducer = (history) => combineReducers({
  router: connectRouter(history),
  todo: Todo,
  auth: Auth,
//   notes: Notes,
//   contact: Contact,
//   common: Common,
//   addUser:AddUser
});

export default rootReducer
