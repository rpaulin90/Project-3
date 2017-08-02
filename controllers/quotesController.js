/**
 * Created by rpaulin on 8/1/17.
 */
var User = require("../models/user");

module.exports = {
    // This method handles creating new quotes
    createUser: function(req, res) {
        User.create(req.body).then(function(doc) {
            res.json(doc);
        }).catch(function(err) {
            res.json(err);
        });
    },

    createTeam: function(req,res) {

        User.findOneAndUpdate({ "uid": req.body.uid }, { $push: { "managedTeams": req.body.team } }, { new: true }, function(err, newteam) {
            // Send any errors to the browser
            if (err) {
                res.send(err);
            }
            // Or send the newdoc to the browser
            else {
                //here we will be creating a team using a Team schema
                res.send("added new team");
            }
        });
    },


    getUserInfo: function(req,res) {

        // We will find all the records, sort it in descending order, then limit the records to 5
        User.find({ "uid": req.body.uid }).sort([
            ["date", "descending"]
        ]).exec(function(err, doc) {
            if (err) {
                console.log(err);
            }
            else {
                res.send(doc);
            }
        });
    }
};
