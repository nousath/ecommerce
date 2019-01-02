// actions chat
import { actionsType } from '../actions/constants.js';

// chat typing
export const chatTyping = (message) => ({
  type: actionsType.CHAT_TYPING,
  payload:message
})

// send message
export const chatSend = (id,admin_user,message)=>({
  type: actionsType.CHAT_SEND,
  payload:{
  	id:id,
    message:message,
    timestamp:new Date().getTime(),
	request:admin_user ? false : true
  }
})