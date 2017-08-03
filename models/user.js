/**
 * Created by rpaulin on 8/1/17.
 */
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: String,
    email: String,
    uid: String,
    managedTeams: [{
        type: Schema.Types.ObjectId,
        ref: "Team"
    }],
    notManagedTeams: [{
        type: Schema.Types.ObjectId,
        ref: "Team"
    }]
});

var User = mongoose.model("User", userSchema);

module.exports = User;

