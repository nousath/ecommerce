// actions config
import { actionsType } from '../actions/constants.js';

export const navigateChange = (navigate) => ({
  type: actionsType.NAVIGATE_CHANGE,
  payload: navigate
})