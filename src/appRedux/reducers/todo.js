import {
  GET_All_TODO_SUCCESS,
  SHOW_MESSAGE,
  RECEIVE_ADD_ITEM,

} from "../constants/ActionTypes";


const INIT_STATE = {
  todoList: [],
  selectedtodoList: [],
  showMessage:false,
  message:''
};


export default (state = INIT_STATE, action) => {

  switch (action.type) {
    case GET_All_TODO_SUCCESS: {
      return {
        ...state,
        showMessage:true,
        todoList: action.payload,
      }
    }
    case RECEIVE_ADD_ITEM:
      const data=[...state.todoList]
      data.push(action.payload)
      console.log(data)
      return {
        ...state,
        showMessage:true,
        messgae:"Added Sucessfully",
        todoList: data.map(value => Object.assign({}, value)),
      };

    case SHOW_MESSAGE:
      return{
        ...state,
        showMessage: true,
        message:"test"
      }
    
    default:
      return state;
  }
}
