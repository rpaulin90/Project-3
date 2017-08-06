/**
 * Created by rpaulin on 7/31/17.
 */
import axios from "axios";

const API = {
    // Retrieves all quotes from the db
    getUserInfo: function(uid) {
        return axios.post("/api/getUserInfo", { uid });
    },
    // Saves a new user to the db
    newUser: function(name,email,uid) {
        return axios.post("/api/newUser", { name,email,uid });
    },
    newTeam: function(uid,team) {
        return axios.post("/api/newTeam", { uid,team });
    },
    joinTeam: function(uid,code) {
        return axios.post("/api/joinTeam", { uid,code });
    },
    getCalendarInfo: function(uid, teamId) {
        return axios.post("/api/getCalendarInfo", { uid, teamId });
    },
    addEvent: function(teamId, calendarEvent) {
        return axios.post("/api/addEvent", { teamId, calendarEvent });
    },
    addParticipant: function(teamId, uid,id, userInfo, nextEvent) {
        return axios.post("/api/addParticipant", { teamId, uid, id, userInfo, nextEvent });
    },
    updateNextEvent: function(nextEvent,teamId) {
        return axios.post("/api/updateNextEvent", { nextEvent, teamId });
    },
    saveLineup: function(teamId, deltas) {
        return axios.post("/api/saveLineup", { teamId, deltas });
    }
    // deleteParticipant: function(teamId, uid,id, name) {
    //     return axios.post("/api/deleteParticipant", { teamId, uid, id, name });
    // }

};

export default API;