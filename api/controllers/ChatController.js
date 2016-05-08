/**
 * ChatController
 *
 * @description :: Server-side logic for managing Chats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	add: function add(request, response) {
		var dataFromClient = request.params.all();
		var firstName = dataFromClient.firstName;
		var lastName = dataFromClient.lastName;
		if( ( typeof(firstName) == "undefined" ) && ( typeof(lastName) == "undefined" ) ) {
			response.forbidden("try to fill all the parameters");
		} else { Contact.create({ first_name: firstName, last_name: lastName }).exec(
			function(err, contact){
				response.ok(contact);
			});
		}
	},
	send: function send(request, response) {
		var dataFromClient = request.params.all();
		if(request.isSocket && request.method === 'POST') {
			console.log("isSocket type POST");
			Message.create(dataFromClient).exec(function(error, dataFromClient) {
				console.log(JSON.stringify(dataFromClient));
				Message.publishCreate(dataFromClient);
				response.ok();
			});

		} else if(request.isSocket) {
			console.log("isSocket");
			Message.watch(request.socket);
			response.ok();

		} else {
			console.log("forbidden");
			response.forbidden();
		}
	},

	friendRequest: function friendRequest(request, response) {
		console.log("inside friendRequest function ! ");
		var data_from_client = request.params.all();
		console.log(data_from_client)
		var _from = data_from_client._from;
		var _to = data_from_client._to;
		if(_from === _to) {
			console.log("You are trying to associate the same ids ");
			response.forbidden("You are trying to associate the same ids");
		} else if( ( typeof(_from) != "undefined" ) && ( typeof(_to) != "undefined" ) ) {
			Relation.find({ is_friend: [_from, _to], with_: [_from, _to] }).exec(function(err, result) {
				if(result.length > 0) {
					console.log("Relation already exist !");
					response.forbidden("Relation already exist !");
				} else {
					Contact.find({ id: [_from, _to] }).exec(function(err, result) {
						
						if(result.length == 2) {

							console.log("The users really exist");

							for(var i = 0, len = result.length ; i < len ; i++) {
								var contact = result[i];
								var is_friend = contact.id;
								var with_ =  contact.id != _to ? _to : _from;
								contact.relations.add({ is_friend: is_friend,  with_: with_ });
								contact.save(function(err){});
							}

							response.ok("Friendship setted");

						} else {
							console.log("2")
							response.forbidden("One or all the guys not exist");
						}
					});
				}
			});
		} else {
			console.log("3")
			response.forbidden("try to fill all the parameters");
		}
	},

	getFriends: function getFriends(request, response) {
		var friends = [];
		var dataFromClient = request.params.all();
		Relation.find({ is_friend: dataFromClient.id }).populate('with_').exec(
			function(err, data){
				console.log(JSON.stringify(data));
				for(var i = 0, len = data.length ; i < len ; i++) {
					var _data = data[i];
					friends.push(_data.with_);
				}
				response.ok(friends);
			});
	},

	getFriendsKeyword: function getFriendsKeyword(request, response) {
		var friends = [];
		var dataFromClient = request.params.all();
		Relation.find({ is_friend: dataFromClient.id }).populate('with_').exec(
			function(err, data) {
				console.log(JSON.stringify(data));
				for(var i = 0, len = data.length ; i < len ; i++) {
					var _data = data[i];
					friends.push(_data.with_.id);
				}

				Contact.find({ where: { id: friends, first_name: { like: dataFromClient.keyword } }, limit: 3}).exec(
				function(err, friends){
					response.ok(friends);
				});
				
			});
	
	}
};

