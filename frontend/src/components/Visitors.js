import React from 'react';
import { reduxGetState } from '../store/redux.js';
import _ from 'lodash'; 

class Visitors extends React.Component{
	render(){
		const state = reduxGetState();
		const chatsAdmin = _.values(state.chatsAdmin);
		if(chatsAdmin.length === 0){
			return <p>:( Not visitors, share the store link</p>	
		}
		const visitors = chatsAdmin.filter(
			session=>_.size(session.chats) === 0 && (session.chatTyping === undefined || session.chatTyping === '')
		);
		if(visitors.length === 0){
			return null;
		}
		var rowCount = 0;
		return [<span className="title">Visitors</span>,
			<table>
				<tr>
					<td>Name</td>
					<td>Since</td>
					<td>Activity</td>
					<td>Page</td>
				</tr>
				{visitors.map(session=>
					<Visitor session={session} rowCount={rowCount++} />
				)}
			</table>]
	}
}

class Visitor extends React.Component{
	constructor(props){
		super(props);
		this.state = {date: new Date().getTime()};
	}
	componentDidMount() {
	    this.timerID = setInterval(
	      () => this.tick(),
	      1000*30
	    );
	}
	componentWillUnmount() {
	    clearInterval(this.timerID);
	}
	tick() {
	    this.setState({
	      date: new Date()
	    });
	}
	timeElapsed(timer){
		var diff = this.state.date - timer;
		var text = '';
		if(diff > 1000*60*60*24){
			const days = Math.floor(diff/1000/60/60/24);
	        diff -= days*1000*60*60*24;
	        text += days+'d ';
	    }
	    if(diff > 1000*60*60){
	        const hours = Math.floor(diff/1000/60/60);
	        diff -= hours*1000*60*60;
	        text += hours+'h ';
	    }
    	const minutes = Math.floor(diff/1000/60);
    	diff -= minutes*1000*60;
    	text += minutes+'m ';  
        return text;
	}
	render(){
		const session = this.props.session;
		const rowCount = this.props.rowCount;
		return <tr className={rowCount % 2 === 0 ? "rowEven" : ""}>
				<td>Visitor {session.id}</td>
				<td>{this.timeElapsed(session.timestamp)}</td>
				<td>{
					session.activity !== undefined && session.activity !== '' ?
					<span>{this.timeElapsed(session.activity)}</span>
					: null				
				}</td>
				<td>{session.navigate}</td>
			</tr>
	}
}

export default Visitors;