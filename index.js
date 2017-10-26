// Módulos
var express = require('express');
var app = express();

// Variables
app.set('port', 8081);

app.get('/', function(req, res) {
	res.send('app bank 2');
})


// lanzar el servidor
app.listen(app.get('port'), function() {
	console.log("Servidor activo");
})
