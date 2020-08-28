import {all, call, fork, put, takeEvery} from "redux-saga/effects";
import {REQUEST_ADD_ITEM} from "../constants/ActionTypes";
import { onAddTodoSuccess,showTodoMessage} from "../../appRedux/actions/todo";
import axios from 'axios';

const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Access-Control-Allow-Origin":"*",
    "Content-type":"application/json",
   }
};

const callTodoRequest= (todo_title, todo_desc,priority)=>{

    return  axios.post("/todos", {
        "todo_title":todo_title, "todo_desc":todo_desc,"priority":priority},config)
         .then(todo =>todo)
         .catch(error=>error)
 
}

function* requestAddItemSaga({payload}) {
  const {todo_title, todo_desc,priority} = payload;
  console.log(payload)
  try {
    const addTodo = yield call(callTodoRequest,todo_title, todo_desc,priority);
    console.log(addTodo)
    if (addTodo.data.status==false) {
      yield put(showTodoMessage("Something went error"));
    } else {
       console.log(addTodo);
       payload.id=addTodo.data.data.id
      yield put(onAddTodoSuccess(payload));
    }
  } catch (error) {
    yield put(showTodoMessage(error));
  }
}







export function* createTodo() {
  yield takeEvery(REQUEST_ADD_ITEM, requestAddItemSaga);
}




export default function* rootSaga() {
  yield all([
    fork(createTodo)
    ]);
}
