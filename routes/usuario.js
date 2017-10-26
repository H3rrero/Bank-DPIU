module.exports = function(app,swig, gestorBD) {
    
        app.get("/usuarios", function(req, res) {
            res.send("ver usuarios");
        });

        app.get("/login", function(req, res) {
            var respuesta = swig.renderFile('views/bidentificacion.html', {
                
            });
           
            res.send(respuesta);
        
        });

        app.get("/registrarse", function(req, res) {

            var respuesta = swig.renderFile('views/bregistro.html', {
                    
            });
            res.send(respuesta);
        
        });

        app.post('/registrarse', function(req, res) {
            
            var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
                .update(req.body.password).digest('hex');
        
            var usuario = {
                email : req.body.email,
                password : seguro
            }
            gestorBD.insertarUsuario(usuario, function(id) {
                if (id == null){
                    res.send("Error al insertar ");
                } else {
                    res.send('Usuario Insertado ' + id);
                }
            });
        
        })
        
    };
    
    