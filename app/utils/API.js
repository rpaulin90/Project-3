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
    // Deletes a quote from the db
    // deleteQuote: function(id) {
    //     return axios.delete(`/api/quotes/${id}`);
    // },
    // Toggles a quote's favorite property in the db
    // favoriteQuote: function(quote) {
    //     quote.favorited = !quote.favorited;
    //     const { _id, favorited } = quote;
    //     return axios.patch(`/api/quotes/${_id}`, { favorited });
    // }
};

export default API;