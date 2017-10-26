module.exports = function(app, swig, mongo) {
    
        app.get("/transacciones", function(req, res) {
            res.send("ver transacciones");
        });
    };
    