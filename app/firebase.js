/**
 * Created by rpaulin on 8/1/17.
 */
import firebase from 'firebase'
const config = {
    apiKey: "AIzaSyBS6g8LPAOpIDRO6_owUQRvuxArXhmJsUY",
    authDomain: "sunday-league.firebaseapp.com",
    databaseURL: "https://sunday-league.firebaseio.com",
    projectId: "sunday-league",
    storageBucket: "",
    messagingSenderId: "1066314378812"
};
firebase.initializeApp(config);
export const auth = firebase.auth();
export default firebase;

