module.exports = function (app, swig, gestorBD, util) {

    app.get("/transacciones", function (req, res) {
    	var criterio = {};
		if( req.query.busqueda != null ){
			criterio = { "concepto" : {$regex : ".*("+req.query.busqueda.toLowerCase()
				+"|"+util.capitalize(req.query.busqueda)+").*"}  };
		}
    	
    	var pg = parseInt(req.query.pg); // Es String !!!
        if (req.query.pg == null) { // Puede no venir el param
            pg = 1;
        }
        gestorBD.obtenerTransacciones(criterio, pg, function (transacciones, total) {
            if (transacciones == null) {
                res.send("Error al listar ");
            } else {
                var ultimaPg = total / 10;
                if (total % 10 > 0) { // Sobran decimales
                    ultimaPg = ultimaPg + 1;
                }

                var paginas = []; // paginas mostrar
                for (var i = 0; i <= ultimaPg; i++) {
                    if (i > 0 && i <= ultimaPg) {
                        paginas.push(i);
                    }
                }
                var respuesta = swig.renderFile('views/transacciones.html', {
                    cabecera: "Todas las transacciones:",
                    transacciones: transacciones,
                    paginas: paginas,
                    actual: pg
                });
                res.send(respuesta);
            }
        });
    });

    app.get("/transacciones/crear", function (req, res) {
        var respuesta = swig.renderFile('views/crearTransaccion.html', {
            cuenta: req.query.cuenta
        });
        res.send(respuesta);
    });

    app.post('/transacciones/crear', function (req, res) {
        var transaccion = {
            cuenta: req.body.cuenta,
            fecha: Date(),
            cantidad: req.body.cantidad,
            concepto: req.body.concepto,
            destinatario: req.body.destinatario,
            favorita: false
        }
        gestorBD.insertarTransaccion(transaccion, function (id) {
            var criterio = { cuenta: transaccion.cuenta };
            gestorBD.obtenerTransacciones(criterio, 1, function (transacciones, total) {
                if (transacciones == null) {
                    res.redirect("/transacciones/" + req.body.cuenta + "?mensaje=La transacción no se ha podido efectuar" +
                        "&tipoMensaje=alert-danger ");
                } else {
                    modificarSaldoCuenta(req.body.cuenta, req.body.cantidad);
                    modificarSaldoCuentaDestino(req.body.destinatario, req.body.cantidad);
                    res.redirect("/transacciones/" + req.body.cuenta + "?mensaje=Transaccion efectuada correctamente");
                }
            });
        });

    })
    function modificarSaldoCuenta(Ncuenta, cantidad) {
        gestorBD.obtenerCuentas({ numero: Ncuenta }, function (cuentas) {
            if (cuentas[0] == null) {

            } else {

                cuenta = cuentas[0];
                cuenta["cantidad"] = cuenta["cantidad"] - cantidad;
                gestorBD.modificarCuenta({ numero: Ncuenta }, cuenta, function (result) {
                    if (result == null) {

                    } else {
                    }
                });


            }
        });
    }
    function modificarSaldoCuentaDestino(Ncuenta, cantidad) {
        gestorBD.obtenerCuentas({ numero: Ncuenta }, function (cuentas) {
            if (cuentas == null) {

            } else {

                cuenta = cuentas[0];
                if (cuenta != undefined) {
                    cuenta["cantidad"] = cuenta["cantidad"] + parseInt(cantidad);
                    gestorBD.modificarCuenta({ numero: Ncuenta }, cuenta, function (result) {
                        if (result == null) {

                        } else {
                        }
                    });
                }

            }
        });
    }
    app.get("/transacciones/repetir", function (req, res) {
        var criterio = { "_id": gestorBD.mongo.ObjectID(req.query.id) };
        gestorBD.repetirTransaccion(criterio, function (transacciones, trans) {
            if (transacciones == null) {
                res.send("Error al repetir ");
            } else {
                gestorBD.obtenerTransacciones({ cuenta: req.query.cuenta }, 1, function (transacciones, total) {
                    if (transacciones == null) {
                        res.redirect("/transacciones/" + req.query.cuenta + "?mensaje=La transacción no se ha podido repetir" +
                            "&tipoMensaje=alert-danger ");
                    } else {

                        modificarSaldoCuenta(trans["cuenta"], trans["cantidad"]);
                        modificarSaldoCuentaDestino(trans["destinatario"], trans["cantidad"]);
                        res.redirect("/transacciones/" + req.query.cuenta + "?mensaje=Transaccion repetida correctamente");
                    }
                });
            }
        });
    });

    app.get('/transacciones/favorita/:id', function (req, res) {
        var id = req.params.id;
        var criterio = { "_id": gestorBD.mongo.ObjectID(id) };

        gestorBD.obtenerTransacciones(criterio, 1, function (transacciones, total) {
            if (transacciones == null) {
                res.redirect("/transacciones/" + req.query.cuenta + "?mensaje=La transacción no se ha podido modificar" +
                    "&tipoMensaje=alert-danger ");
            } else {
                transaccion = transacciones[0];
                cuenta = transaccion["cuenta"];
                if (transaccion["favorita"] == true) {
                    transaccion["favorita"] = false;
                    mensaje = "Transaccion eliminada a favoritas"
                }
                else {
                    transaccion["favorita"] = true;
                    mensaje = "Transaccion añadida a favoritas"
                }
                gestorBD.modificarTransaccion(criterio, transaccion, function (result) {
                    if (result == null) {
                        res.redirect("/transacciones/" + cuenta + "?mensaje="+mensaje);
                    } else {
                        res.redirect("/transacciones/" + cuenta + "?mensaje="+mensaje);
                    }
                });
            }
        });


    })
    app.get("/transacciones/:cuenta", function (req, res) {
        var criterio = {};
		if( req.query.busqueda != null ){
			criterio = { "concepto" : {$regex : ".*("+req.query.busqueda.toLowerCase()
				+"|"+util.capitalize(req.query.busqueda)+").*"},
				cuenta: req.params.cuenta};
		}
		else
	        criterio = { cuenta: req.params.cuenta };
		var pg = parseInt(req.query.pg); // Es String !!!
        if (req.query.pg == null) { // Puede no venir el param
            pg = 1;
        }
        gestorBD.obtenerTransacciones(criterio, pg, function (transacciones, total) {
            if (transacciones == null) {
                res.send("Error al listar ");
            } else {
                var ultimaPg = total / 10;
                if (total % 10 > 0) { // Sobran decimales
                    ultimaPg = ultimaPg + 1;
                }

                var paginas = []; // paginas mostrar
                for (var i = 0; i <= ultimaPg; i++) {
                    if (i > 0 && i <= ultimaPg) {
                        paginas.push(i);
                    }
                }
                var respuesta = swig.renderFile('views/transacciones.html', {
                    cabecera: "Transacciones de: " + req.params.cuenta,
                    transacciones: transacciones,
                    cuenta: req.params.cuenta,
                    paginas: paginas,
                    actual: pg
                });
                res.send(respuesta);
            }
        });
    });

    app.get("/busqueda", function (req, res) {
    	 var respuesta = swig.renderFile('views/busqueda.html', {
             cabecera: "Busqueda avanzada"
         });
         res.send(respuesta);
    });
    
    app.post("/busqueda", function (req, res) {
    	var criterio = {
    			concepto: req.body.concepto? {$regex : ".*("+req.body.concepto.toLowerCase()
    				+"|"+util.capitalize(req.body.concepto)+").*"}: {$regex : ".*"},
    			cuenta: req.body.cuenta? {$regex : ".*("+req.body.cuenta.toLowerCase()
        			+"|"+util.capitalize(req.body.cuenta)+").*"}: {$regex : ".*"},
        		destinatario: req.body.destinatario? {$regex : ".*("+req.body.destinatario.toLowerCase()
            		+"|"+util.capitalize(req.body.destinatario)+").*"}: {$regex : ".*"}
    			
    	};
    	console.log(criterio)
    	var pg = parseInt(req.query.pg); // Es String !!!
        if (req.query.pg == null) { // Puede no venir el param
            pg = 1;
        }
        gestorBD.obtenerTransacciones(criterio, pg, function (transacciones, total) {
            if (transacciones == null) {
                res.send("Error al listar ");
            } else {
                var ultimaPg = total / 10;
                if (total % 10 > 0) { // Sobran decimales
                    ultimaPg = ultimaPg + 1;
                }

                var paginas = []; // paginas mostrar
                for (var i = 0; i <= ultimaPg; i++) {
                    if (i > 0 && i <= ultimaPg) {
                        paginas.push(i);
                    }
                }
                var respuesta = swig.renderFile('views/transacciones.html', {
                    cabecera: "Busqueda avanzada:",
                    transacciones: transacciones,
                    paginas: paginas,
                    actual: pg
                });
                res.send(respuesta);
            }
        });
   });

};
