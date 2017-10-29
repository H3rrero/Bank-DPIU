module.exports = function(app, swig, gestorBD) {
    
        app.get("/transacciones", function(req, res) {
        	var pg = parseInt(req.query.pg); // Es String !!!
    		if ( req.query.pg == null){ // Puede no venir el param
    			pg = 1;
    		}
    		gestorBD.obtenerTransacciones({}, pg, function(transacciones, total) {
                if (transacciones == null) {
                    res.send("Error al listar ");
                } else {
                	var ultimaPg = total/10;
    				if (total % 10 > 0 ){ // Sobran decimales
    					ultimaPg = ultimaPg+1;
    				}

    				var paginas = []; // paginas mostrar
    				for(var i = 0 ; i <= ultimaPg ; i++){
    					if ( i > 0 && i <= ultimaPg){
    						paginas.push(i);
    					}
    				}
    				var respuesta = swig.renderFile('views/transacciones.html', {
        				cabecera: "Todas las transacciones:",
        				transacciones: transacciones,
    					paginas : paginas,
    					actual : pg	
        			});
                    res.send(respuesta); 
                }
            }); 
		});
        
        app.get("/transacciones/crear", function(req, res) {
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
					destinatario: req.body.destinatario
            }
            gestorBD.insertarTransaccion(transaccion, function (id) {
            	var criterio = {cuenta: transaccion.cuenta};
            	gestorBD.obtenerTransacciones(criterio, 1, function(transacciones, total) {
                    if (transacciones == null) {
                    	res.redirect("/transacciones/" + req.body.cuenta +"?mensaje=La transacción no se ha podido efectuar"+
						"&tipoMensaje=alert-danger "); 
                    } else {
                        res.redirect("/transacciones/" + req.body.cuenta +"?mensaje=Transaccion efectuada correctamente"); 
                    }
                }); 
            });

        })
        
        app.get("/transacciones/repetir", function(req, res) {
        	var criterio = {"_id": gestorBD.mongo.ObjectID(req.query.id)};
        	gestorBD.repetirTransaccion(criterio, function(transacciones) {
                if (transacciones == null) {
                    res.send("Error al repetir ");
                } else {
                	gestorBD.obtenerTransacciones({cuenta: req.query.cuenta}, 1, function(transacciones, total) {
                        if (transacciones == null) {
                            res.redirect("/transacciones/" + req.query.cuenta +"?mensaje=La transacción no se ha podido repetir"+
    								"&tipoMensaje=alert-danger "); 
                        } else {
                            res.redirect("/transacciones/" + req.query.cuenta +"?mensaje=Transaccion repetida correctamente"); 
                        }
                    });
                }
            });  
		});
        
        app.get("/transacciones/:cuenta", function(req, res) {
        	var criterio = {cuenta: req.params.cuenta};
        	var pg = parseInt(req.query.pg); // Es String !!!
    		if ( req.query.pg == null){ // Puede no venir el param
    			pg = 1;
    		}
    		gestorBD.obtenerTransacciones(criterio, pg, function(transacciones, total) {
                if (transacciones == null) {
                    res.send("Error al listar ");
                } else {
                	var ultimaPg = total/10;
    				if (total % 10 > 0 ){ // Sobran decimales
    					ultimaPg = ultimaPg+1;
    				}

    				var paginas = []; // paginas mostrar
    				for(var i = 0 ; i <= ultimaPg ; i++){
    					if ( i > 0 && i <= ultimaPg){
    						paginas.push(i);
    					}
    				}
    				var respuesta = swig.renderFile('views/transacciones.html', {
        				cabecera: "Transacciones de: " + req.params.cuenta,
        				transacciones : transacciones,
        				cuenta: req.params.cuenta,
    					paginas : paginas,
    					actual : pg
        			});
                    res.send(respuesta);
                }
            });  
		});
        
     
    };
    