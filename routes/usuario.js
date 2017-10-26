module.exports = function(app,swig, mongo) {
    
        app.get("/usuarios", function(req, res) {
            res.send("ver usuarios");
        });

        app.get("/login", function(req, res) {
            var respuesta = swig.renderFile('views/bidentificacion.html', {
                
            });
        
            res.send(respuesta);
        
        });
    };
    
    