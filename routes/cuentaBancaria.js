module.exports = function(app, swig, mongo) {
    
        app.get("/cuentas", function(req, res) {
            res.send("ver cuentas");
        });
    };
    