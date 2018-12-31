import React from 'react';
import { reduxGetState } from '../store/redux.js';
import '../css/Notification.scss';

class Notification extends React.Component{
	render(){
		const state = reduxGetState();
		const count = state.notifications.length;
		if(count !== 0){ // there are errors
			const first = state.notifications.pop();
			const typeClass = (first.type === 'E' ? 'notificationError' : 'notificationMessage');
			var message = first.message;
			var title = '';
			if(message.length > 60){
				title = message;
				message = message.substring(0,59) + "...";
			}
			return <div className="notification">
					<span className={typeClass} title={title}>
						{message}
						{count > 1 ? ' ('+count+')' : ''}
					</span>
				</div>
		}else{
			return null;
		}
	}
}

export default Notification;