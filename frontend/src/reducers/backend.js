/**
 * reductors connect to backend for persistence
 * 
 */
import { updateStore } from '../store/backend.js';

export function backendReducers(state = {}, action) {
    updateStore(state,action);
    // reducers dont change redux state just send info to backend
    return state;
}