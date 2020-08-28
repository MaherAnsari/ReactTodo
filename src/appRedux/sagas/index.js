import {all} from "redux-saga/effects";
import authSagas from "./Auth";
import todoSagas from "./Todo";
// import notesSagas from "./Notes";
// import userSagas from "./AddUser";

export default function* rootSaga(getState) {
  yield all([
    authSagas(),
    todoSagas(),
    // notesSagas(),
    // userSagas()
  ]);
}
