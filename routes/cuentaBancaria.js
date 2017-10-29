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
        var cuenta = {
            numero : "ES"+ Math.floor(Math.random() * 1000000000), 
            titular : req.body.titular,
            correo : req.session.usuario,
            tipo : req.body.tipo,
            fechaCreacion : Date(),
            cantidad : 100
        };
        console.log(cuenta);
        gestorBD.insertarCuenta(cuenta, function (id) {
            if (id == null) {
            	res.redirect("/cuentas?mensaje=No se ha podido crear la cuenta"+
					"&tipoMensaje=alert-danger "); 
            } else {
            	res.redirect("/cuentas?mensaje=La cuenta se ha creado satisfactoriamente");    
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
				res.redirect("/cuentas?mensaje=No se ha podido borrar la cuenta"+
					"&tipoMensaje=alert-danger "); 
			} else {
				res.redirect("/cuentas?mensaje=La cuenta se ha borrado satisfactoriamente"); 
			}
		});
    });
    
    app.post('/cuenta/modificar/:id', function (req, res) {
		var id = req.params.id;
		var criterio = { "_id" : gestorBD.mongo.ObjectID(id)  };
		
		var cuenta = {
            titular : req.body.titular,
            correo : req.session.usuario,
            tipo : req.body.tipo,
            fechaCreacion : Date(),
            cantidad : 100
        };

		gestorBD.modificarCuenta(criterio, cuenta, function(result) {
			if (result == null) {
				res.redirect("/cuenta/modificar/" + id + "?mensaje=No se ha podido modificar la cuenta"+
					"&tipoMensaje=alert-danger "); 
			} else {
				res.redirect("/cuenta/modificar/"+ id +"?mensaje=La cuenta se ha modificado satisfactoriamente"); 
			}
		});
	})

    app.get("/cuenta/crear", function (req, res) {
        var respuesta = swig.renderFile('views/crearCuenta.html', {});
        res.send(respuesta);
    });
};
