// actions config
import { CONFIG_STORE_NAME } from '../actions/constants.js';

export const storeName = (name) => ({
  type: CONFIG_STORE_NAME,
  payload: name
})