import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import App from './components/App.js';
import { reduxSubscribe, reduxGetState, reduxDispatch } from './store/redux.js';
import { backendLoad } from './store/backend.js';
import { notificationError } from './actions/notifications.js';

const render = () => {
  console.log("redux state render ", reduxGetState());
  return ReactDOM.render(<App />, document.getElementById("root"));
};

// request sessiontoken from localstorage, then request info from backend
backendLoad()
	.catch((err)=>{
		// show Error to user
		reduxDispatch(notificationError(err));
	})
	.finally(()=>{
		render();
		// load reactjs into html after redux update
		reduxSubscribe(render);
	});

// serviceworker for offline
serviceWorker.register();