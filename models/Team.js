/**
 * Created by rpaulin on 8/2/17.
 */

// Require mongoose
var mongoose = require("mongoose");

// Create a Schema class with mongoose
var Schema = mongoose.Schema;

// make TeamSchema a Schema
var TeamSchema = new Schema({
    // author: just a string
    name: {
        type: String
    },
    nextEvent: [],
    calendarGames: [],
    members: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }]
});

// NOTE: the team's id is stored automatically
// Our User model will have an array to store these ids

// Create the Team model with the TeamSchema
var Team = mongoose.model("Team", TeamSchema);

// Export the model so we can use it on our server file.
module.exports = Team;
