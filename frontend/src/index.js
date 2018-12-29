import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import App from './App.js';
import { reduxSubscribe, reduxGetState } from './store/redux.js';
import { backendLoad } from './store/backend.js';

const render = () => {
  console.log("redux state render ", reduxGetState());
  return ReactDOM.render(<App />, document.getElementById("root"));
};

// request sessiontoken from localstorage, then request info from backend
backendLoad()
	.catch((err)=>{
		console.log('reject',err);
		console.trace();
	})
	.finally(()=>{
		render();
		// load reactjs into html after redux update
		reduxSubscribe(render);
	});

// serviceworker for offline
serviceWorker.register();