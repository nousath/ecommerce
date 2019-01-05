import React from 'react';
import { reduxGetState, reduxDispatch } from '../store/redux.js';
import { chatSend } from '../actions/chats.js';
import Visitors from '../components/Visitors.js';
import _ from 'lodash'; 
import '../css/Chat.scss';

class ChatAdmin extends React.Component{
	render(){
		const state = reduxGetState();
		const chatsAdmin = _.values(state.chatsAdmin);
		const conversations = chatsAdmin.filter(
			session=>_.size(session.chats) > 0 || (session.chatTyping !== undefined && session.chatTyping !== '')
		);
		return <div className="page-chat">
			{conversations.length > 0  ?
				<span className="title">Conversations</span>
				: null
			}
			{conversations.map(session=>
				<ChatSummary session={session} />
			)}
			<Visitors/>
		</div>


		// VOY AQUI
		// building component
		// separate conversations from sessions
		// order by timestamp
		// actions for answer the chat
	}
}

class ChatSummary extends React.Component{
	render(){
		return <p>summary</p>
	}
}

export default ChatAdmin;