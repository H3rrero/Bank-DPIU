module.exports = {
	mongo : null,
	app : null,
	init : function(app, mongo) {
		this.mongo = mongo;
		this.app = app;
	},
	obtenerUsuarios : function(criterio,funcionCallback){
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				
				var collection = db.collection('usuarios');
				collection.find(criterio).toArray(function(err, usuarios) {
					if (err) {
						funcionCallback(null);
					} else {
						funcionCallback(usuarios);
					}
					db.close();
				});
			}
		});
	},
	insertarUsuario : function(usuario, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				var collection = db.collection('usuarios');
				collection.insert(usuario, function(err, result) {
					if (err) {
						funcionCallback(null);
					} else {
						funcionCallback(result.ops[0]._id);
					}
					db.close();
				});
			}
		});
	},
	obtenerCuentas : function(criterio,funcionCallback){
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				
				var collection = db.collection('cuentas');
				collection.find(criterio).toArray(function(err, cuentas) {
					console.log(cuentas);
					console.log(criterio);
					if (err) {
						funcionCallback(null);
					} else {
						funcionCallback(cuentas);
					}
					db.close();
				});
			}
		});
	},
	modificarCuenta : function(criterio, cuenta, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				var collection = db.collection('cuentas');
				collection.update(criterio, {$set: cuenta}, function(err, result) {
					if (err) {
						funcionCallback(null);
					} else {
						funcionCallback(result);
					}
					db.close();
				});
			}
		});
	},
	eliminarCuenta : function(criterio, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				var collection = db.collection('cuentas');
				collection.remove(criterio, function(err, result) {
					if (err) {
						funcionCallback(null);
					} else {
						funcionCallback(result);
					}
					db.close();
				});
			}
		});
	},
	insertarCuenta : function(cuenta, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				var collection = db.collection('cuentas');
				collection.insert(cuenta, function(err, result) {
					if (err) {
						funcionCallback(null);
					} else {
						console.log(cuenta);
						funcionCallback(result.ops[0]._id);
					}
					db.close();
				});
			}
		});
	}
};
