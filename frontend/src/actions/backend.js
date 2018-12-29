// actions api
import { actionsType } from '../actions/constants.js';

// save api session from database
export const backendSession = (storeToken, sessionToken) => ({
  type: actionsType.BACKEND_SESSION,
  payload: {
  	storeToken,
  	sessionToken
  }
})