import React from 'react';
import { reduxGetState, reduxDispatch } from '../store/redux.js';
import { chatTyping, chatSend } from '../actions/chats.js';
import _ from 'lodash'; 
import '../css/Chat.scss';

class Chat extends React.Component{
	render(){
		const state = reduxGetState()
		const chats = _.values(state.chats)
		const admin_user = state.config.admin_user;
		var welcome = state.config.chat_welcome;
		if(welcome === '' || welcome === undefined){
			// default message
			welcome = 'Hello, do you need help with your shopping?';
		}
		return <div className="page-chat">
				<div className="chat-messages">
					{chats.length === 0 && ! admin_user ?
						<span className="chat-response">{welcome}</span>
						:
					chats.map(chat=>
						<ChatMessage chat={chat} admin_user={admin_user} />
					)}
				</div>
				{admin_user ? <ChatSuggestions /> : null}
				<ChatInput admin_user={admin_user}/>
			</div>
	}
}

class ChatMessage extends React.Component{
	render(){
		const chat = this.props.chat;
		const admin_user = this.props.admin_user;
		var chatType = '';
		if(admin_user){
			chatType = chat.request ? 'chat-response' : 'chat-request'
		}else{
			chatType = chat.request ? 'chat-request' : 'chat-response'
		}
		return <span className={chatType}>
				{chat.message}
			</span>
	}
}

class ChatSuggestions extends React.Component{
	render(){
		const state = reduxGetState();
		var quick_answer = state.config.chat_quick_answer;
		if(quick_answer === undefined || quick_answer === null){
			// default answer
			quick_answer = [
				"Hello, how can i help you",
				"Thanks for contact us"
			];
		}
		return <div class="chat-suggestions">
			<span>Automatic responses</span>
			{quick_answer.map(quick=>
				<span class="chat-suggest">
				{quick}
			</span>	
			)}
		</div>
	}
}

class ChatInput extends React.Component{
	chatHandler(){
		const state = reduxGetState();
		const newid = _.size(state.chats) + 1;
		reduxDispatch(chatSend(newid, this.props.admin_user ,state.chatTyping));
		reduxDispatch(chatTyping(""));
	}
	chatEnterHandler(event){		
		if(event.key === 'Enter'){
			this.chatHandler();			
		}
	}
	chatTypingHandler(event){
		const message = event.target.value;
		reduxDispatch(chatTyping(message));
	}
	render(){
		const state = reduxGetState();
		return <div className="chat-text">
			<input type="text" placeholder="Message" 
				onKeyPress={this.chatEnterHandler.bind(this)}
				onChange={this.chatTypingHandler.bind(this)}
				value={state.chatTyping} />
			<button onClick={this.chatHandler.bind(this)}><span>Enviar</span></button>
		</div>
	}
}

export default Chat;	