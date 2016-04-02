'use strict';

// server.js (Express 4.0)

// BASE SETUP
// ==============================================

// call the packages we need
let express = require('express'),
		app = express(),
		bodyParser = require('body-parser'),
		mongoose = require('mongoose'),
		dbURI = 'mongodb://localhost/test',
		port = process.env.PORT || 3000;

// connect to mongodb
mongoose.connect(dbURI);

// 

let Pintura= require('./app/api/models/pinturas');


// DEFINE THE MIDDLEWARE FOR APP
// ==============================================

// configure app to use bodyParser()
// this will let us get data from POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// ROUTES
// ==============================================

// get an instance of the express router
let apiRouter = express.Router();

// test router
// apiRouter.get('/', (req, res) => {
// 	res.json({ message: 'welcome to out api' });
// });

// MIDDLEWARE to use for all requests
apiRouter.use((req, res, next) => {
	// do something before running routes
	console.log('Happening before routes...');
	next();   // don't stop here, go to next route
});

// routes 
// generic root route of the api
apiRouter.get('/', (req, res) => {
	res.json({ message: 'Hello API!' });
});

// on routes that end in /beers
apiRouter.route('/pinturas')
	// create a pintura (http://localhost:3000/api/pinturas)
	.post((req, res) => {
		let pintura = new Pintura();

		pintura.autor = req.body.autor;
		pintura.periodo = req.body.periodo;
		pintura.estilo = req.body.estilo;
		pintura.descripcion = req.body.descripcion;
		pintura.exposicion = req.body.exposicion;

		pintura.save(err => {
			if (err) res.send(err);
			res.json({ message: 'Pintura created!' });
		});
	})
	// get all beers (http://localhost:3000/api/pinturas)
	.get((req, res) => {
		Pintura.find((err, pinturas) => {
			if (err) res.send(err);
			res.json(pinturas);
		});
	});

// on routes that end in /pinturas/:beer_id
apiRouter.route('/pinturas/:pintura_id')
	// get a beer by id (http://localhost:3000/api/pinturas/:pintura_id)
	.get((req, res) => {
		Pinturas.findById(req.params.pintura_id, (err, pintura) => {
			if (err) res.send(err);
			res.json(pintura);
		});
	})
	// update a beer by id (http://localhost:8080/api/pinturas/:pintura_id)
	.put((req, res) => {
		Pintura.findById(req.params.pintura_id, (err, pintura) => {
			if (err) res.send(err);
			// update info
			pintura.autor = req.body.autor;
			pintura.periodo = req.body.periodo;
			pintura.estilo = req.body.estilo;
			pintura.descripcion = req.body.descripcion;
			pintura.exposicion = req.body.exposicion;

			// save beer
			pintura.save(err => {
				if (err) res.send(err);
				res.json({ message: 'Pintura updated!' });
			});
		});
	})
	// delete a beer by id (http://localhost:3000/api/pinturas/:pintura_id)
	.delete((req, res) => {
		Pintura.remove({ _id: req.params.pintura_id }, (err, pintura) => {
			if (err) res.send(err);
			res.json({ message: 'Successfully deleted!'});
		});
	});




//autor busqueda
apiRouter.route('/pinturas/autor/query')
	.get((req,res)=> {
		let autorString = req.query.autor;
		Pintura.find({"autor":{"$regex": autorString}},(err,pinturas) => {
			if (err) res.send(err);
			res.json(pinturas);
		})
	});

//tema busqueda

apiRouter.route('/pinturas/tema/query')
	.get((req,res)=> {
		let descripcionString = req.query.descripcion;
		Pintura.find({"descripcion":{"$regex": descripcionString}},(err,pinturas) => {
			if (err) res.send(err);
			res.json(pinturas);
		})
	});

//nombre busqueda

apiRouter.route('/pinturas/nombre/query')
	.get((req,res)=> {
		let nombreString = req.query.descripcion;
		Pintura.find({"descripcion":{"$regex": nombreString}},(err,pinturas) => {
			if (err) res.send(err);
			res.json(pinturas);
		})
	});


// register our routes
// all routes will be prefixed with /api
app.use('/api', apiRouter);



// START THE SERVER
// ==============================================
app.listen(port);
console.log('Magic happens on port ' + port);
