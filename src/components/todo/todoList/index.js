import React,{Component} from 'react';
import MaterialTable from 'material-table';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import {connect} from "react-redux";
import {onAddTodo, onDeleteTodo, onGetAllTodo, onUpdateTodo,showTodoMessage} from "../../../appRedux/actions/todo";
import axios from 'axios';
import { th, el, tr } from 'date-fns/locale';
const config = {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}`,
  "Access-Control-Allow-Origin":"*",
  "Content-type":"application/json",
 }
};


class TodoList extends Component {

  constructor() {
    super();
    this.state = {
      noTodoFoundMessage: 'No Contact found in selected folder',
      alertMessage: '',
      open:false,
      filterOption: 'All contacts',
      allTodo: [],
      data:[],
      selectedTodo: null,
      addTodoState: false,
      columns: [
        {title: "id", field: "id", hidden: true},
      { title: 'Title', field: 'todo_title',required:true },
      { title: 'Description', field: 'todo_desc' ,required:true},

      {
        title: 'Priority',
        field: 'priority',
        lookup: { 1: 'Hot', 2: 'Warn',3:'Cold',4:'Dead' },
        required:true
      },
    ],
  
    }
  }

  componentDidMount(){
    console.log('hell')
    this.props.onGetAllTodo();
  }

  componentWillMount() {
    this.props.onGetAllTodo();
  }

  componentWillReceiveProps(nextProps) {
    console.log("todoList", nextProps.todoList)
    if (nextProps.todoList) {
      console.log(nextProps.message)
      this.setState({
        allTodo: nextProps.todoList,
        data: nextProps.todoList,
        alertMessage:nextProps.message,
        open:true
      })
    }
  }

  onSaveTodo = (newdata) => {
      this.props.onAddTodo(newdata);
  };

  onTodoUpdate=(oldData,newData)=>{
    axios.put(`/todos/${oldData.id}`,newData,config)
    .then((res)=>{
      if(res.data.status==true){
        this.setState((prevState) => {
          const data = [...prevState.data];
          data[data.indexOf(oldData)] = newData;
          return { ...prevState, data };
        });
        this.setState({open:true,alertMessage:"Updated Sucessfully"})
      }
      else{
        this.setState({open:true,alertMessage:"Something went wrong"})
      }
    })
    .catch((err)=>{
      console.log(err)
    })
    // this.props.onUpdateTodo(newdata);
  }
  onTodoDelete = (oldData) => {
    axios.delete(`/todos/${oldData.id}`,config)
    .then((res)=>{
      console.log(res)
      if(res.data.status){
        this.setState((prevState) => {
          const data = [...prevState.data];
          data.splice(data.indexOf(oldData), 1);
          return { ...prevState, data };
        });
        this.setState({open:true,alertMessage:"Deleted Sucessfully"})
      }else{
        this.setState({open:true,alertMessage:"Something went wrong"})
      }
    })
    .catch((err)=>{
      console.log(err)
    })
  };
  
  render() {
    const {columns,data,alertMessage,open} = this.state;
    return (
      <>
      {alertMessage&&open?
       <Collapse in={open}>
       <Alert
         action={
           <IconButton
             aria-label="close"
             color="inherit"
             size="small"
             onClick={() => {
               this.setState({open:false});
             }}
           >
             <CloseIcon fontSize="inherit" />
           </IconButton>
         }
       >
         {alertMessage}!
       </Alert>
     </Collapse>:null}
        
        <MaterialTable
          title="Editable Example"
          columns={columns}
          data={data}
          options={{
            filtering: true
          }}
          editable={{
            onRowAdd: (newData) =>
              new Promise((resolve) => {
                setTimeout(() => {
                  resolve();
                  if(newData){
                    this.onSaveTodo(newData)
                  }
                }, 800);
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve) => {
                setTimeout(() => {
                  resolve();
                  if (oldData) {
                    this.onTodoUpdate(oldData,newData)
                  }
                }, 800);
              }),
            onRowDelete: (oldData) =>
              new Promise((resolve) => {
                setTimeout(() => {
                  resolve();
                  this.onTodoDelete(oldData)
                }, 800);
              }),
          }}
        />
        </>
    );
  }

  
}

const mapStateToProps = ({todo}) => {
  const {todoList, selectedTodo,message} = todo;
  return {todoList, selectedTodo,message}
};
export default connect(mapStateToProps, {
  onGetAllTodo,
  onAddTodo,
  showTodoMessage,
})(TodoList);