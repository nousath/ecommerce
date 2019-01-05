// generate info to store owner or admin user

const mongo = require('./mongodb.js');
const tools = require('./tools.js');

// request list user with current navigate page
function adminChats(storeObject, sessionObject){
	return new Promise((fullfill, reject)=>{
		var otherSessions = null;
		var chats = new Array();
		var waiting = 2;
		const nextStep = ()=>{
			waiting--;
			if(waiting == 0){
				fullfill(adminChatsJoin(otherSessions,chats));
			}
		};
		// search list session of store
		mongo.collection('session',collection=>{
			return collection.find(
				{
					$and:[
						{storeId:storeObject.id},
						{rol:{$in:[tools.SESSION_VISITOR,tools.SESSION_VISITOR_ANNON]}}
						]
				})
				.sort({activity:-1})
				.limit(100)
				.toArray();
		},(result=>{
			otherSessions = result;
			nextStep();
		}),reject);
		// search list chats
		mongo.cursor("chat",{storeId:storeObject.id},{sessionToken:-1},
			chat=>{
				// base on chats order by sessionToken for avoid search into chats
				var lastConversation = (chats.length === 0 ? new Object() : chats.pop());
				if(lastConversation.sessionToken !== chat.sessionToken){
					chats.push(lastConversation);
					lastConversation = {
						sessionToken:chat.sessionToken,
						chats:new Array()
					}
				}
				lastConversation.chats.push(chat);
				chats.push(lastConversation);
			})
			.then(nextStep)
			.catch(reject);
	});
}

// once complete request to session and chat info
function adminChatsJoin(otherSessions,chats){
	// join list session and chats
	var count = 1;
	return otherSessions.map(session=>{
		var chat = chats.find(chat=>{
				return chat.sessionToken === session.token;
			});
		if(chat === undefined){
			chat = new Object();			
		}else{
			chat = chat.chats;
			chat = tools.DBCleanInternals(chat);
			chat = tools.arrayToObject(chat);
		}
		return {
			id:count++,
			sessionToken:session.token,
			timestamp:session.timestamp,
			activity:session.activity,
			navigate:session.navigate,
			chatTyping:session.chatTyping,
			chats:chat
		}
	});	
}

module.exports = {
	chats:adminChats
}