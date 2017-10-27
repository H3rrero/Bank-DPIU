module.exports = function(app, swig, gestorBD) {
    
        app.get("/transacciones", function(req, res) {
			var respuesta = swig.renderFile('views/transacciones.html', {});
            res.send(respuesta);  
		});
    };
    