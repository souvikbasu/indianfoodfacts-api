var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var FOOD_COLLECTION = "foods";

var app = express();
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI, function(err, database) {
    if (err) {
        console.log(err);
        process.exit(1);
    }

    // Save database object from the callback for reuse.
    db = database;
    console.log("Database connection ready");

    // Initialize the app.
    var server = app.listen(process.env.PORT || 8080, function() {
        var port = server.address().port;
        console.log("App now running on port", port);
    });
});

// FOOD API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
}

/*  "/api/foods"
 *    GET: find food matching string
 *    POST: creates a new contact
 */

app.get("/api/food/:name", function(req, res) {
    var foodName = req.params.name;

    db.collection(FOOD_COLLECTION).findOne({"name": {"$regex": foodName, "$options": "i"}}, function(err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to get contact");
        } else {
            if (doc == null) {
                doc = {};
            }
            res.status(200).json(doc);
        }
    });
});

app.get("/api/anyfood", function(req, res) {
    var random = Math.floor(Math.random() * 8000);

    db.collection(FOOD_COLLECTION).find().skip(100).limit(2).exec(
        function(err, doc) {
            if (err) {
                handleError(res, err.message, "Failed to get contact");
            } else {
                if (doc == null) {
                    doc = {};
                }
                res.status(200).json(doc);
            }
        });
});
