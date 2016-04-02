// beers model

'use strict';

let mongoose = require('mongoose'),
		Schema = mongoose.Schema;

let	PinturasSchema = new Schema({
	autor: String,
	periodo: String,
	estilo: String,
	descripcion: String,
	exposicion: String

});

module.exports = mongoose.model('Pintura', PinturasSchema);


