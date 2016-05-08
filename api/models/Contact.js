/**
 * Contact.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {


    attributes: {

	  	first_name: {
	  		type: 'string',
	  		size: 50,
	  		required: true
	  	},
	  	last_name: {
	  		type: 'string',
	  		size: 50,
	  		required: true
	  	},
	  	relations: {
	  		collection: 'Relation',
	  		via: 'is_friend'
	  	}
  }


};



