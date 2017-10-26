// Módulos
var express = require('express');
var app = express();

var mongo = require('mongodb');
var swig = require('swig');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Variables
app.set('port', 8081);
app.set('db','mongodb://admin:admin@ds237475.mlab.com:37475/bank');
//Rutas/controladores por lógica
require("./routes/usuario.js")(app, swig,mongo);  // (app, param1, param2, etc.)
require("./routes/cuentaBancaria.js")(app, swig,mongo);  // (app, param1, param2, etc.)
require("./routes/transacciones.js")(app, swig,mongo);

app.get('/', function (req, res) {
    res.redirect('/login');
})


// lanzar el servidor
app.listen(app.get('port'), function () {
    console.log("Servidor activo");
})
