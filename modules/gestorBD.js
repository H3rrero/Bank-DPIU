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
	},
	
	obtenerTransacciones : function(criterio, pg, funcionCallback){
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				funcionCallback(null);
			} else {		
				var collection = db.collection('transacciones');
				collection.find(criterio).count(function(err, count){
					collection.find(criterio).sort({ favorita: -1, fecha:1 }).skip( (pg-1)*8 ).limit( 8 )
						.toArray(function(err, transacciones) {		
						if (err) {
							funcionCallback(null);
						} else {
							funcionCallback(transacciones, count);
						}
						db.close();
					});
					
				});
			}
		});
	},
	
	insertarTransaccion : function(transaccion, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				var collection = db.collection('transacciones');
				collection.insert(transaccion, function(err, result) {
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
	modificarTransaccion : function(criterio, trans, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				var collection = db.collection('transacciones');
				collection.update(criterio, {$set: trans}, function(err, result) {
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
	repetirTransaccion : function(criterio, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				
				var collection = db.collection('transacciones');
				collection.find(criterio).toArray(function(err, transacciones) {
					if (err) {
						funcionCallback(null);
					} else {
						var transaccionRep = {
								cuenta: transacciones[0].cuenta,
								fecha: new  Date().getDate()+"/"+(parseInt(new Date().getMonth())+1)+"/"+ new Date().getFullYear(),
								cantidad: transacciones[0].cantidad,
								concepto: transacciones[0].concepto,
								destinatario: transacciones[0].destinatario,
								correo : req.session.usuario,
								favorita: transacciones[0].favorita
						}
						collection.insert(transaccionRep, function(err, result) {
							if (err) {
								funcionCallback(null);
							} else {
								funcionCallback(result.ops[0]._id,transacciones[0]);
							}
						});				
					}
					db.close();
				});
			}
		});
	},
};
