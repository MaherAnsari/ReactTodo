
import {FETCH_START,FETCH_SUCCESS, GET_All_TODO_SUCCESS,REQUEST_ADD_ITEM, RECEIVE_ADD_ITEM,SHOW_MESSAGE} from  "../constants/ActionTypes";
import axios from 'axios';

const config = {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}`,
  "Access-Control-Allow-Origin":"*",
  "Content-type":"application/json",
 }
};

export const onGetAllTodo = () => {
  return (dispatch) => {
    dispatch({type: FETCH_START});
     axios.get('/todos/lists',config)
    .then((res)=>{
        dispatch({type: FETCH_SUCCESS});
        dispatch({
            type: GET_All_TODO_SUCCESS,
            payload: res.data.data
        });
        })
    .catch((err)=>console.log(err))
  };
};


export const onAddTodo = (todo) => {
  return {
    type: REQUEST_ADD_ITEM,
    payload: todo
  };
};

export const onAddTodoSuccess = (todo) => {
  return {
    type: RECEIVE_ADD_ITEM,
    payload: todo
  };
};

export const showTodoMessage=(message)=>{
return{
  type:SHOW_MESSAGE,
  payload:message
}
}






