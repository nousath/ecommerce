import React from 'react';
import { reduxGetState } from '../store/redux.js';
import '../css/Content.scss';
import StoreCreate from '../components/StoreCreate.js'


// main, it is like a router, changing base on store.navigate
class Content extends React.Component{
	render(){
		const state = reduxGetState();
		var gui = "";
		if(this.props.storeNew){
			gui = <StoreCreate storeName={this.props.storeName} />;
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