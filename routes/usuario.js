module.exports = function (app, swig, gestorBD) {



    app.get("/login", function (req, res) {
        var respuesta = swig.renderFile('views/bidentificacion.html', {});
        res.send(respuesta);
    });

    app.get("/registrarse", function (req, res) {

        var respuesta = swig.renderFile('views/bregistro.html', {

        });
        res.send(respuesta);

    });

    app.post('/registrarse', function (req, res) {

        var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');

        var usuario = {
            email: req.body.email,
            password: seguro
        }
        gestorBD.insertarUsuario(usuario, function (id) {
            if (id == null) {
                res.send("Error al insertar ");
            } else {
                res.send('Usuario Insertado ' + id);
            }
        });

    })

    app.post("/login", function (req, res) {
        var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');

        var criterio = {
            email: req.body.email,
            password: seguro
        }

        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                req.session.usuario = null;
                res.send("No identificado: ");
            } else {
                req.session.usuario = usuarios[0].email;
                
                res.redirect('/cuentas');
            }

        });
    });

    app.get('/desconectarse', function (req, res) {
        req.session.usuario = null;
        res.redirect('/login');
    });


};

