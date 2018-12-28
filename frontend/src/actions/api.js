// actions api
import { API_SESSION } from '../actions/constants.js';

// save api session from database
export const apiSession = (storeToken, sessionToken) => ({
  type: API_SESSION,
  payload: {
  	storeToken,
  	sessionToken
  }
})