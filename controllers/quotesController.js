/**
 * Created by rpaulin on 8/1/17.
 */
var User = require("../models/user");
var Team = require("../models/Team");

module.exports = {
    // This method handles creating new quotes
    createUser: function(req, res) {

        var newUser = new User({
            name: req.body.name,
            email: req.body.email,
            uid: req.body.uid,
        });

        newUser.save(function(error, doc) {
            // Log any errors
            if (error) {
                console.log(error);
            }
            // Or log the doc
            else {
                console.log(doc);
                res.send("added new user");
            }
        });

    },

    createTeam: function(req,res) {

        var newTeam = new Team({name:req.body.team});

        newTeam.save(function(err, doc) {
            // Send an error to the browser if there's something wrong
            if (err) {
                console.log(err);
                res.send(err);
            }
            // Otherwise...
            else {

                User.findOneAndUpdate({"uid": req.body.uid}, { $push: { "managedTeams": doc._id } }, { new: true }, function(error, doc) {
                    // Send any errors to the browser
                    if (error) {
                        res.send(error);
                    }
                    // Or send the doc to the browser
                    else {
                        res.send(doc);
                    }
                });
            }
        });

    },

    joinTeam: function(req,res) {

        Team.find({ "_id": req.body.code }, function(err, doc) {
            if (err) {

                throw err
            }
            else {

                User.findOneAndUpdate({"uid": req.body.uid}, { $push: { "notManagedTeams": req.body.code } }, { new: true }, function(error, doc2) {
                    // Send any errors to the browser
                    if (error) {
                        res.send(error);
                    }
                    // Or send the doc to the browser
                    else {
                        res.send(doc2);
                    }
                });
            }
        });


    },


    getUserInfo: function(req,res) {

        User.find({ "uid": req.body.uid }).populate("managedTeams").populate("notManagedTeams").exec(function(err, doc) {
            if (err) {

                throw err
            }
            else {

                res.send(doc);
            }
        });
    }

};
