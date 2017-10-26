module.exports = function(app, swig, gestorBD) {
    
        app.get("/transacciones", function(req, res) {
            res.send("ver transacciones");
        });
    };
    