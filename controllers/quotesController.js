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
            phone: req.body.phone,
            profilePic: req.body.profilePic,
            email: req.body.email,
            uid: req.body.uid,
            confirmed: false,
            date: "not set"
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

        var newTeam = new Team({name:req.body.team,nextEvent: {status: "no events yet"},members:req.body._id});

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

    // This method handles deleting quotes
    deleteTeam: function(req, res) {
        Team.remove({
            _id: req.params.id
        }).then(function(doc) {
            res.send("team deleted");
        }).catch(function(err) {
            res.send(err);
        });
    },

    joinTeam: function(req,res) {

        Team.findOneAndUpdate({ "_id": req.body.code }, { $push: { "members": req.body._id }}, function(err, doc) {
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
    },

    getCalendarInfo: function(req,res) {

        User.find({ "uid": req.body.uid }).populate("managedTeams").populate("notManagedTeams").exec(function(err, doc) {
            if (err) {

                throw err
            }
            else {

                Team.find({ "_id": req.body.teamId }).populate("members").exec(function(error, doc2) {
                    if (error) {

                        throw error
                    }
                    else {

                        res.send([doc,doc2]);

                    }


                });

            }
        });
    },

    addEvent: function(req,res) {

        Team.findOneAndUpdate({"_id": req.body.teamId}, { $push: { "calendarGames": req.body.calendarEvent }, $set: { "nextEvent.0": req.body.calendarEvent } }, { new: true }, function(error, doc) {
            // Send any errors to the browser
            if (error) {
                res.send(error);
            }
            // Or send the doc to the browser
            else {
                res.send(doc);
            }
        });

    },

    addParticipant: function(req,res) {


        User.findOneAndUpdate({ "uid": req.body.uid },{$set: {"confirmed": true, date: req.body.nextEvent.start}}, function(err,doc1){
            if (err) {
                console.log(err);
                throw err
            }
            else {

                // how can i push information into a nested array to an object with a given id?

                Team.findOneAndUpdate({"_id": req.body.teamId}, { $push: { "nextEvent.0.participants": req.body.userInfo }  }, { new: true }, function(error, doc2) {
                    // Send any errors to the browser
                    if (error) {
                        res.send(error);
                    }
                    // Or send the doc to the browser
                    else {
                        res.send([doc1,doc2]);
                    }
                });

            }
        });

    },

    updateNextEvent: function(req,res) {

        Team.findOneAndUpdate({"_id": req.body.teamId}, { $set: { "nextEvent.0": req.body.nextEvent }  }, { new: true }, function(error, doc) {
            // Send any errors to the browser
            if (error) {
                res.send(error);
            }
            // Or send the doc to the browser
            else {
                console.log("im heeere");
                res.send(doc);
            }
        });

    },

    saveLineup: function(req,res) {

        Team.findOneAndUpdate({"_id": req.body.teamId}, { $set: { "nextEvent.0.lineup": req.body.deltas, "nextEvent.0.lineupNames": req.body.names }  }, { new: true }, function(error, doc) {
            // Send any errors to the browser
            if (error) {
                res.send(error);
            }
            // Or send the doc to the browser
            else {
                console.log("req.body.deltas");
                console.log(req.body.deltas);
                console.log("updated lineups");
                res.send(doc);
            }
        });

    }

    // deleteParticipant: function(req,res) {
    //
    //
    //     Team.findOneAndUpdate({"_id": req.body.teamId}, { $push: { "calendarGames.0.participants": req.body.name }, $set: {"calendarGames.0.confirmed": true}  }, { new: true }, function(error, doc) {
    //         // Send any errors to the browser
    //         if (error) {
    //             res.send(error);
    //         }
    //         // Or send the doc to the browser
    //         else {
    //             res.send(doc);
    //         }
    //     });
    //
    //
    //
    // }

};
