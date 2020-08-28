
import React,{useState,useEffect} from 'react';
import PropTypes from 'prop-types';
import {Container,Avatar,Button,CssBaseline,TextField ,Checkbox,Link,Grid,Box,Typography,makeStyles}from  '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import Alert from '@material-ui/lab/Alert';
import {hideMessage,showAuthLoader,userSignIn,} from "../appRedux/actions/AuthActions";


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
  useEffect(() => {
    if (showMessage) {
      setTimeout(() => {
       dispatch(hideMessage());
      }, 100);
    }
    if (authUser !== null) {
      history.push('/todo');
    }
  });
  const handleSigninSubmit=(e)=>{
    e.preventDefault()
    let username=document.getElementById('email').value;
    let password=document.getElementById('password').value;
    const values={
        "username":username?username:'',
        "password":password?password:''
    }
    if(username ==''){
      setErrorMsg('Please enter the email')
      setShowErrorMsg(true);
      return false;
    }
    if(password ==''){
      setErrorMsg('Please enter the password')
      setShowErrorMsg(true);
      return false;
    }
    console.log(values)
    dispatch(userSignIn(values));
}
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {showErrorMsg?<Alert severity="error">{errorMsg}</Alert>:null}
        <form className={classes.form} noValidate onSubmit={handleSigninSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
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
            autoComplete="current-password"
          />
         
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}

