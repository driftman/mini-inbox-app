/**
 * Message.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	from: {
  		model: 'Contact',
  		required: true
  	},
  	to: {
  		model: 'Contact',
  		required: true
  	},
  	message: {
  		type: "string",
  		size: 255,
  		required: true
  	}
  }
};

