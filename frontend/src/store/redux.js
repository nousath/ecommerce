// create redux store
import { createStore } from 'redux';
import rootReducer from '../reducers';

var redux = ''; // store

// create store after backend request
export function reduxCreateStore(initialState = {}) {
	redux = createStore(
	    rootReducer,
	    initialState
	);
};

export function reduxGetState(){
	return redux.getState();
};

export function reduxDispatch(action){
	return redux.dispatch(action);
}

export function reduxSubscribe(callback){
	return redux.subscribe(callback);
}