module.exports = function(app, swig, gestorBD) {
    
        app.get("/cuentas", function(req, res) {
            res.send("ver cuentas");
        });
    };
    