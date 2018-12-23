import React from 'react';
import redux from '../store/';
import '../css/Content.scss';
import StoreCreate from '../components/StoreCreate.js'


// main, it is like a router, changing base on store.navigate
class Content extends React.Component{
	render(){
		const state = redux.getState();
		var gui = "";
		if(this.props.newStore){
			gui = <StoreCreate storeName={state.config.store.name}></StoreCreate>;
		}else{
			switch(state.navigate){
				case "Chat":
					gui = "";
					break;
				default:
					gui = "";
			}
		}
		return <div className="content">
			{gui}
			</div>
	}
}

export default Content;