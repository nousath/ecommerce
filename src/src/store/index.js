// create redux store
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';

// default state with design data
const initialState = JSON.stringify('../redux/example.json');

const store = createStore(
    rootReducer,
    initialState,
    //applyMiddleware(thunk)
);

export default store;