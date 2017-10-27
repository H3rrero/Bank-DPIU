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


        var cuenta = {
            numero : "ES"+ parseInt(Math.random()*1000000000000000000000000), 
            titular : req.body.titular,
            correo : req.session.usuario,
            tipo : req.body.tipo,
            fechaCreacion : Date(),
            trasacciones : [],
            cantidad : 100
        };
        gestorBD.insertarCuenta(cuenta, function (id) {
            if (id == null) {
                res.send("Error al insertar ");
            } else {
                res.redirect('/cuentas');
            }
        });

    });

    app.get("/cuenta/crear", function (req, res) {
        var respuesta = swig.renderFile('views/crearCuenta.html', {});
        res.send(respuesta);
    });
};
