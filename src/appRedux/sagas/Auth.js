import {all, call, fork, put, takeEvery} from "redux-saga/effects";
import {
  SIGNIN_USER,
  SIGNOUT_USER,
  SIGNUP_USER
} from "../constants/ActionTypes";
import {showAuthMessage, userSignInSuccess, userSignOutSuccess, userSignUpSuccess,userSignUp} from "../actions/AuthActions";
import axios from 'axios';
import jwt_decode from 'jwt-decode';
// import Api from '../../config/dev';
import setAuthorizationToken from '../../utils/setAuthorizationToken';


const createUserWithEmailPasswordRequest = async (email, password,username) =>{
  return await axios.post("/users", {
    'email':email,
    'password':password,
    "username":username
    })
    .then(authUser =>authUser.data)
    .catch(error=>error)
}


const signInUserWithEmailPasswordRequest=async(username,password)=>{

 return  await axios.post("/users/login/", {
     'email':username,
     'password':password
     })
      .then(authUser =>authUser.data)
      .catch(error=>error)
}

function* createUserWithEmailPassword({payload}) {
  const {email, password,username,} = payload;
  try {
    const signUpUser = yield call(createUserWithEmailPasswordRequest, email, password,username);
    console.log(signUpUser)
    if (signUpUser.status ==false) {
      yield put(showAuthMessage(signUpUser.message));
    } else {
      console.log(signUpUser.data)
      const userInfo=jwt_decode(signUpUser.data)
      console.log(userInfo)
      localStorage.setItem('user_id', userInfo.result.insertId);
      localStorage.setItem('token', signUpUser.data);

      yield put(userSignUpSuccess(userInfo.result.insertId));
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}


// const signOutRequest = async () =>
//   await  auth.signOut()
//     .then(authUser => authUser)
//     .catch(error => error);


function* signInUserWithEmailPassword({payload}) {
  const {username, password} = payload;
  try {
    const signInUser = yield call(signInUserWithEmailPasswordRequest, username, password);
    console.log(signInUser)
    if (signInUser.message) {
      yield put(showAuthMessage(signInUser.message));
    } else {
      const userInfo=jwt_decode(signInUser.token)
      localStorage.setItem('user_id', userInfo.result.id);
      localStorage.setItem('token', signInUser.token);
      localStorage.setItem("todo_token_ExpTime", userInfo.exp);
      setAuthorizationToken(signInUser.token);
      yield put(userSignInSuccess(userInfo.result.id));
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}

function* signOut() {
  try {

      localStorage.removeItem('user_id');
      localStorage.removeItem('token');
      localStorage.removeItem('todo_token_ExpTime');

  } catch (error) {
    yield put(showAuthMessage(error));
  }
}

export function* createUserAccount() {
  yield takeEvery(SIGNUP_USER, createUserWithEmailPassword);
}

export function* signInUser() {
  yield takeEvery(SIGNIN_USER, signInUserWithEmailPassword);
}

export function* signOutUser() {
  yield takeEvery(SIGNOUT_USER, signOut);
}

export default function* rootSaga() {
  yield all([fork(signInUser),
    fork(signOutUser),
    fork(createUserAccount),
    ]);
}
