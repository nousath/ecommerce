// actions config
import { actionsType } from '../actions/constants.js';

export const storeName = (name) => ({
  type: actionsType.CONFIG_STORE_NAME,
  payload: name
})