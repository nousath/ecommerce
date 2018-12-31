// error
import { actionsType } from '../actions/constants.js';

export const notificationError = (message, source='FRONTEND') => ({
  type: source === 'FRONTEND' ? actionsType.NOTIFICATION_ERROR_FRONTEND : actionsType.NOTIFICATION_ERROR_BACKEND,
  payload: {
  	type:'E',
  	message
  }
})

export const notificationClock = () => ({
  type: actionsType.NOTIFICATION_CLOCK
})