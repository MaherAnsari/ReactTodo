
import React,{useState,useEffect,useRef } from 'react';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import PropTypes from 'prop-types';
import {Container,Avatar,Button,CssBaseline,TextField ,FormControlLabel,Checkbox,Link,Grid,Box,Typography,makeStyles}from  '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {hideMessage,showAuthLoader,userSignUp,} from "../appRedux/actions/AuthActions";
import Alert from '@material-ui/lab/Alert';
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {loader, alertMessage, showMessage,authUser}= useSelector(({auth}) => auth);
  const history = useHistory();
  const[username,setUsername]=useState('');
  const[password,setPassword]=useState('');
  const [errorMsg,setErrorMsg]=useState([]);
  const [showErrorMsg,setShowErrorMsg]=useState(false);
  const [disabledLoginBtn,setDisabledLoginBtn]=useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (showMessage) {
      setErrorMsg(alertMessage)
      setShowErrorMsg(showMessage)
      setTimeout(() => {
       dispatch(hideMessage());
      }, 100);
    }
    if (authUser !== null) {
      window.location.href='/todo'
      history.push('/todo');
    }
    ValidatorForm.removeValidationRule('isPasswordMatch');
    ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
      if (value !== this.state.user.password) {
          return false;
      }
      return true;
  });
  });
  const handleSigninSubmit=(e)=>{
    e.preventDefault()
    let email=document.getElementById('email').value;
    let password=document.getElementById('password').value;
    let username=document.getElementById('username').value;
    let confirmPassword=document.getElementById('confirmPassword').value;
    if(password !=confirmPassword){
      setShowErrorMsg(true)
      setErrorMsg('Password not match');
      return false;
    }
    const values={
        "email":email?email:'',
        "username":username?username:'',
        "password":password?password:'',

    }
    console.log(values)
    dispatch(showAuthLoader());
    dispatch(userSignUp(values));
    console.log(authUser)
    }
  return (
    <Container component="main" maxWidth="xs">
   
      
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        {showErrorMsg?<Alert severity="error">{errorMsg}</Alert>:null}
        <ValidatorForm
        ref={ref}
        className={classes.form}
        onSubmit={handleSigninSubmit}
        onError={errors => console.log(errors)}
        >

        
        {/* <form 
         noValidate
        > */}
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            type="email"
            autoFocus
            validators={['required', 'isEmail']}
            errorMessages={['this field is required', 'email is not valid']}
          />
           <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="User Name"
            name="username"
            autoComplete="username"
            autoFocus
            
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            validators={['required']}
            errorMessages={['this field is required']}
            autoComplete="current-password"
          />
           <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirmpassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="current-password"
            validators={['isPasswordMatch', 'required']}
            errorMessages={['password mismatch', 'this field is required']}
          />
         
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Ups
          </Button>
          <Grid container>
            <Grid item>
              <Link href="/signin" variant="body2">
                {"Login"}
              </Link>
            </Grid>
          </Grid>
        {/* </form> */}
        </ValidatorForm>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}

