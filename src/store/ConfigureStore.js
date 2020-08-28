import createSagaMiddleware from "redux-saga";
import {createStore, applyMiddleware} from 'redux';
import rootReducer from '../appRedux/reducers';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import { routerMiddleware } from "connected-react-router";
import thunk from "redux-thunk";
import rootSaga from "../appRedux/sagas/index";

const createBrowserHistory = require("history").createBrowserHistory;

export const history = createBrowserHistory();

const routeMiddleware = routerMiddleware(history);
const sagaMiddleware = createSagaMiddleware();

const middlewares = [thunk, sagaMiddleware, routeMiddleware];
export default function configureStore(initialState) {


	const store=createStore(
		rootReducer(history),
		initialState,
		applyMiddleware(
			reduxImmutableStateInvariant(),
			routerMiddleware(history),
			...middlewares
			),
		
	);

	sagaMiddleware.run(rootSaga);
	return store
}