// actions config
import { EDIT_CONFIG_STORE_NAME } from '../actions/constants.js';

export const editStoreName = (name) => ({
  type: EDIT_CONFIG_STORE_NAME,
  payload: name
})