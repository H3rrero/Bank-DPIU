module.exports = function(app, swig, gestorBD) {
    
        app.get("/cuentas", function(req, res) {
			var respuesta = swig.renderFile('views/cuentas.html', {});
            res.send(respuesta); 
		});
    };
    