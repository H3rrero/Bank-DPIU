module.exports = function (app, swig, gestorBD) {

    app.get("/cuentas", function (req, res) {
        var criterio = {  };
        
                gestorBD.obtenerCuentas(criterio, function(cuentas) {
                    if (cuentas == null) {
                        res.send("Error al listar ");
                    } else {
                        var respuesta = swig.renderFile('views/cuentas.html', 
                        {
                            cuentas : cuentas
                        });
                        res.send(respuesta);
                    }
                });
    });

    app.post('/cuenta/crear', function (req, res) {
        console.log("Titular:");
        console.log(req.body);
        var cuenta = {
            numero : "ES"+ Math.floor(Math.random() * 1000000000), 
            titular : "Alejandro",
            correo : req.session.usuario,
            tipo : "Plazos",
            fechaCreacion : Date(),
            trasacciones : [],
            cantidad : -100
        };
        gestorBD.insertarCuenta(cuenta, function (id) {
            if (id == null) {
                res.send("Error al insertar ");
            } else {
                res.redirect('/cuentas');
            }
        });

    });

    app.get('/cuenta/modificar/:id', function (req, res) {
		var criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id)  };
		
		gestorBD.obtenerCuentas(criterio,function(cuentas){
			if ( cuentas == null ){
				res.send(respuesta);
			} else {
				var respuesta = swig.renderFile('views/modificarCuenta.html', 
				{
					cuenta : cuentas[0]
				});
				res.send(respuesta);
			}
		});
    });

    app.get('/cuenta/delete/:id', function (req, res) {
		var criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id)  };
		
		gestorBD.eliminarCuenta(criterio,function(cuentas){
			if ( cuentas == null ){
				res.send(respuesta);
			} else {
				
				res.redirect('/cuentas');
			}
		});
    });
    
    app.post('/cuenta/modificar/:id', function (req, res) {
		var id = req.params.id;
		var criterio = { "_id" : gestorBD.mongo.ObjectID(id)  };
		
		var cuenta = {
            numero : "ES"+ Math.floor(Math.random() * 1000000000), 
            titular : "Modificado",
            correo : req.session.usuario,
            tipo : "Plazos",
            fechaCreacion : Date(),
            trasacciones : [],
            cantidad : 100
        };

		gestorBD.modificarCuenta(criterio, cuenta, function(result) {
			if (result == null) {
				res.send("Error al modificar ");
			} else {
                res.redirect('/cuentas');
			
			}
		});
	})

    app.get("/cuenta/crear", function (req, res) {
        var respuesta = swig.renderFile('views/crearCuenta.html', {});
        res.send(respuesta);
    });
};
