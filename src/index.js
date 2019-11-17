import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./app/MainApp";
import ConfigureStore from "./store/ConfigureStore";
import registerServiceWorker from "./registerServiceWorker";
import Amplify from 'aws-amplify';
import aws_exports from './aws_exports';
import "./assets/css/index.css";

Amplify.configure(aws_exports);

const store = ConfigureStore();

ReactDOM.render(
	<Provider store={store}>
	  <Router>
	    <App />
	  </Router>
	</Provider>,
  document.getElementById("root")
);
registerServiceWorker();