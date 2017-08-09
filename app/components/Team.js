/**
 * Created by rpaulin on 8/2/17.
 */
import React, { Component } from "react";
import firebase, { auth } from '../firebase.js';
import API from "../utils/API";
import { Link, withRouter } from "react-router";
import moment from 'moment';
var Draggable = require("react-draggable");
import Field from "./common/Field";
import CopyToClipboard from 'react-copy-to-clipboard';
import ModalTeam from "./common/ModalTeam";


class Team extends Component {

    constructor() {
        super();
        this.state = {
            loading: true,
            isOpen: false,
            teamId: "",
            currentUid: "",
            managedTeams: [],
            notManagedTeams: [],
            manager:false,
            teamInfo:{},
            nextEvent:"",
            userInfo: "",
            confirmed: false,
            participants:[],
            user: null, // <-- add this line
            activeDrags: 0, // draggable states
            deltaPosition1: {
                x: 0, y: 0
            },
            deltaPosition2: {
                x: 0, y: 0
            },
            deltaPosition3: {
                x: 0, y: 0
            },
            deltaPosition4: {
                x: 0, y: 0
            },
            deltaPosition5: {
                x: 0, y: 0
            },
            deltaPosition6: {
                x: 0, y: 0
            },
            deltaPosition7: {
                x: 0, y: 0
            },
            deltaPosition8: {
                x: 0, y: 0
            },
            deltaPosition9: {
                x: 0, y: 0
            },
            deltaPosition90: {
                x: 0, y: 0
            },
            deltaPosition91: {
                x: 0, y: 0
            },
            controlledPosition: {
                x: -400, y: 200
            },
            deltas:[{
                x: 0, y: 0
            },{
                x: 0, y: 0
            },{
                x: 0, y: 0
            },{
                x: 0, y: 0
            },{
                x: 0, y: 0
            },{
                x: 0, y: 0
            },{
                x: 0, y: 0
            },{
                x: 0, y: 0
            },{
                x: 0, y: 0
            },{
                x: 0, y: 0
            },{
                x: 0, y: 0
            }],
            name1:"click to edit",
            name2:"click to edit",
            name3:"click to edit",
            name4:"click to edit",
            name5:"click to edit",
            name6:"click to edit",
            name7:"click to edit",
            name8:"click to edit",
            name9:"click to edit",
            name90:"click to edit",
            name91:"click to edit",
            copied:false

        };

        this.logout = this.logout.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
        this.handleConfirmLineup = this.handleConfirmLineup.bind(this);
        this.handleDrag1 = this.handleDrag1.bind(this);
        this.handleDrag2 = this.handleDrag2.bind(this);
        this.handleDrag3 = this.handleDrag3.bind(this);
        this.handleDrag4 = this.handleDrag4.bind(this);
        this.handleDrag5 = this.handleDrag5.bind(this);
        this.handleDrag6 = this.handleDrag6.bind(this);
        this.handleDrag7 = this.handleDrag7.bind(this);
        this.handleDrag8 = this.handleDrag8.bind(this);
        this.handleDrag9 = this.handleDrag9.bind(this);
        this.handleDrag90 = this.handleDrag90.bind(this);
        this.handleDrag91 = this.handleDrag91.bind(this);
        this.onStart = this.onStart.bind(this);
        this.onStop = this.onStop.bind(this);
        this.adjustXPos = this.adjustXPos.bind(this);
        this.adjustYPos = this.adjustYPos.bind(this);
        this.onControlledDrag = this.onControlledDrag.bind(this);
        this.onControlledDragStop = this.onControlledDragStop.bind(this);
        this.handleChange1 = this.handleChange1.bind(this);
        this.handleChange2 = this.handleChange2.bind(this);
        this.handleChange3 = this.handleChange3.bind(this);
        this.handleChange4 = this.handleChange4.bind(this);
        this.handleChange5 = this.handleChange5.bind(this);
        this.handleChange6 = this.handleChange6.bind(this);
        this.handleChange7 = this.handleChange7.bind(this);
        this.handleChange8 = this.handleChange8.bind(this);
        this.handleChange9 = this.handleChange9.bind(this);
        this.handleChange90 = this.handleChange90.bind(this);
        this.handleChange91 = this.handleChange91.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.renderRoster = this.renderRoster.bind(this);
        //this.handleUnConfirm = this.handleUnConfirm.bind(this);

    }

    componentDidMount() {

        console.dir(this.props);
        this.fireBaseListener = auth.onAuthStateChanged((user) => {
            if (user) {
                const uid = auth.currentUser.uid;

                API.getCalendarInfo(uid, this.props.params.id).then((res) => {
                    // console.log("res.data[1][0]");
                    // console.log(res.data[1][0]);
                    console.log("res");
                    console.log(res);
                    var nextEvent;
                    var attending = false;
                    var participantsArray;
                    var deltasArray = this.state.deltas;
                    var name1 = this.state.name1;
                    var name2 = this.state.name2;
                    var name3 = this.state.name3;
                    var name4 = this.state.name4;
                    var name5 = this.state.name5;
                    var name6 = this.state.name6;
                    var name7 = this.state.name7;
                    var name8 = this.state.name8;
                    var name9 = this.state.name9;
                    var name90 = this.state.name90;
                    var name91 = this.state.name91;

                    if(res.data[1][0].calendarGames.length === 0){
                        nextEvent = false;

                    }else{


                        for(let y = 0; y < res.data[1][0].nextEvent[0].participants.length; y++){
                            if(res.data[1][0].nextEvent[0].participants[y].uid === uid){
                                attending = true

                            }
                        }
                        participantsArray = res.data[1][0].nextEvent[0].participants;

                        deltasArray = res.data[1][0].nextEvent[0].lineup;

                        name1 = res.data[1][0].nextEvent[0].lineupNames[0];
                        name2 = res.data[1][0].nextEvent[0].lineupNames[1];
                        name3 = res.data[1][0].nextEvent[0].lineupNames[2];
                        name4 = res.data[1][0].nextEvent[0].lineupNames[3];
                        name5 = res.data[1][0].nextEvent[0].lineupNames[4];
                        name6 = res.data[1][0].nextEvent[0].lineupNames[5];
                        name7 = res.data[1][0].nextEvent[0].lineupNames[6];
                        name8 = res.data[1][0].nextEvent[0].lineupNames[7];
                        name9 = res.data[1][0].nextEvent[0].lineupNames[8];
                        name90 = res.data[1][0].nextEvent[0].lineupNames[9];
                        name91 = res.data[1][0].nextEvent[0].lineupNames[10];


                        var sortedArray = res.data[1][0].calendarGames;

                        sortedArray.sort(function(a,b){
                            return new Date(a.start) - new Date(b.start);
                        });

                        var counter = 0;
                        var nextDate = moment(new Date(sortedArray[counter].start));
                        nextEvent = sortedArray[counter];

                        while (nextDate.diff(moment(), "seconds") <= 0) {
                            counter++;
                            nextDate = moment(new Date(sortedArray[counter].start));
                            nextEvent = sortedArray[counter];
                        }

                        if(nextEvent.id !== res.data[1][0].nextEvent[0].id) {
                            //attending = false;
                            API.updateNextEvent(nextEvent, this.props.params.id).then((response) => {
                                console.log("updated next event");
                            });
                            participantsArray = [];
                        }

                    }

                    if(res.data[0][0].managedTeams.length === 0) {

                        this.setState({
                            user,
                            currentUid: auth.currentUser.uid,
                            managedTeams: res.data[0][0].managedTeams,
                            notManagedTeams: res.data[0][0].notManagedTeams,
                            teamId: this.props.params.id,
                            manager: false,
                            teamInfo: res.data[1][0],
                            nextEvent: nextEvent,
                            userInfo: res.data[0][0],
                            confirmed: attending,
                            participants: participantsArray,
                            deltas: deltasArray,
                            name1: name1,
                            name2: name2,
                            name3: name3,
                            name4: name4,
                            name5: name5,
                            name6: name6,
                            name7: name7,
                            name8: name8,
                            name9: name9,
                            name90: name90,
                            name91: name91,
                            loading: false
                        });

                    } else{

                        for(var x = 0; x < res.data[0][0].managedTeams.length; x++){
                            if(res.data[0][0].managedTeams[x]._id === this.props.params.id){

                                this.setState({
                                    user,
                                    currentUid: auth.currentUser.uid,
                                    managedTeams: res.data[0][0].managedTeams,
                                    notManagedTeams: res.data[0][0].notManagedTeams,
                                    teamId: this.props.params.id,
                                    manager: true,
                                    teamInfo: res.data[1][0],
                                    nextEvent: nextEvent,
                                    userInfo: res.data[0][0],
                                    confirmed: attending,
                                    participants: participantsArray,
                                    deltas: deltasArray,
                                    name1: name1,
                                    name2: name2,
                                    name3: name3,
                                    name4: name4,
                                    name5: name5,
                                    name6: name6,
                                    name7: name7,
                                    name8: name8,
                                    name9: name9,
                                    name90: name90,
                                    name91: name91,
                                    loading: false
                                });
                                return

                            }else{
                                this.setState({
                                    user,
                                    currentUid: auth.currentUser.uid,
                                    managedTeams: res.data[0][0].managedTeams,
                                    notManagedTeams: res.data[0][0].notManagedTeams,
                                    teamId: this.props.params.id,
                                    manager: false,
                                    teamInfo: res.data[1][0],
                                    nextEvent: nextEvent,
                                    userInfo: res.data[0][0],
                                    confirmed: attending,
                                    participants: participantsArray,
                                    deltas: deltasArray,
                                    name1: name1,
                                    name2: name2,
                                    name3: name3,
                                    name4: name4,
                                    name5: name5,
                                    name6: name6,
                                    name7: name7,
                                    name8: name8,
                                    name9: name9,
                                    name90: name90,
                                    name91: name91,
                                    loading: false
                                });
                            }
                        }

                    }




                });

            }
        });
    }
    componentWillUnmount() {
        this.fireBaseListener && this.fireBaseListener();
    }

    logout(event) {
        //var that = this;
        event.preventDefault();
        auth.signOut()
            .then(() => {
                this.props.router.push('/');
            });

    }

    handleConfirm(event) {

        event.preventDefault();

        API.addParticipant(this.state.teamId,this.state.currentUid, this.state.nextEvent.id, this.state.userInfo, this.state.nextEvent).then((res) => {

            console.log(res);
            this.setState({nextEvent: res.data[1].nextEvent[0], confirmed: true, participants:res.data[1].nextEvent[0].participants });

        });


    }

    handleConfirmLineup(event) {

        event.preventDefault();

        if(this.state.nextEvent){

            let newDeltasArray = [
                {
                    x: this.state.deltaPosition1.x + this.state.teamInfo.nextEvent[0].lineup[0].x,
                    y: this.state.deltaPosition1.y + this.state.teamInfo.nextEvent[0].lineup[0].y,

                },
                {
                    x: this.state.deltaPosition2.x + this.state.teamInfo.nextEvent[0].lineup[1].x,
                    y: this.state.deltaPosition2.y + this.state.teamInfo.nextEvent[0].lineup[1].y,

                },
                {
                    x: this.state.deltaPosition3.x + this.state.teamInfo.nextEvent[0].lineup[2].x,
                    y: this.state.deltaPosition3.y + this.state.teamInfo.nextEvent[0].lineup[2].y,

                },
                {
                    x: this.state.deltaPosition4.x + this.state.teamInfo.nextEvent[0].lineup[3].x,
                    y: this.state.deltaPosition4.y + this.state.teamInfo.nextEvent[0].lineup[3].y,

                },
                {
                    x: this.state.deltaPosition5.x + this.state.teamInfo.nextEvent[0].lineup[4].x,
                    y: this.state.deltaPosition5.y + this.state.teamInfo.nextEvent[0].lineup[4].y,

                },
                {
                    x: this.state.deltaPosition6.x + this.state.teamInfo.nextEvent[0].lineup[5].x,
                    y: this.state.deltaPosition6.y + this.state.teamInfo.nextEvent[0].lineup[5].y,

                },
                {
                    x: this.state.deltaPosition7.x + this.state.teamInfo.nextEvent[0].lineup[6].x,
                    y: this.state.deltaPosition7.y + this.state.teamInfo.nextEvent[0].lineup[6].y,

                },
                {
                    x: this.state.deltaPosition8.x + this.state.teamInfo.nextEvent[0].lineup[7].x,
                    y: this.state.deltaPosition8.y + this.state.teamInfo.nextEvent[0].lineup[7].y,

                },
                {
                    x: this.state.deltaPosition9.x + this.state.teamInfo.nextEvent[0].lineup[8].x,
                    y: this.state.deltaPosition9.y + this.state.teamInfo.nextEvent[0].lineup[8].y,

                },
                {
                    x: this.state.deltaPosition90.x + this.state.teamInfo.nextEvent[0].lineup[9].x,
                    y: this.state.deltaPosition90.y + this.state.teamInfo.nextEvent[0].lineup[9].y,

                },
                {
                    x: this.state.deltaPosition91.x + this.state.teamInfo.nextEvent[0].lineup[10].x,
                    y: this.state.deltaPosition91.y + this.state.teamInfo.nextEvent[0].lineup[10].y,

                }
            ];

            let newNames = [this.state.name1,this.state.name2,this.state.name3,this.state.name4,this.state.name5,this.state.name6,this.state.name7,this.state.name8,this.state.name9,this.state.name90,this.state.name91,];


            API.saveLineup(this.state.teamId, newDeltasArray, newNames).then((res) => {

                console.log("saved lineup");

            });

        }else{
            console.log("create an event first")
        }



    }

    // handleUnConfirm(event) {
    //
    //     event.preventDefault();
    //
    //     API.deleteParticipant(this.state.teamId,this.state.currentUid, this.state.nextEvent.id, this.state.userInfo.name).then((res) => {
    //
    //         for(let x = 0; x < res.data.calendarGames.length ; x++){
    //             if(res.data.calendarGames[x].id === this.state.nextEvent.id){
    //
    //                 this.setState({nextEvent: res.data.calendarGames[x]})
    //
    //             }
    //         }
    //
    //     });
    //     //this.setState({ inputValueCode: "" });
    //
    //
    // }

    //// Draggable methods

    handleDrag1(e, ui) {
        const {x, y} = this.state.deltaPosition1;
        this.setState({
            deltaPosition1: {
                x: x + ui.deltaX,
                y: y + ui.deltaY,
            }
        });
    }

    handleDrag2(e, ui) {
        const {x, y} = this.state.deltaPosition2;
        this.setState({
            deltaPosition2: {
                x: x + ui.deltaX,
                y: y + ui.deltaY,
            }
        });
    }

    handleDrag3(e, ui) {
        const {x, y} = this.state.deltaPosition3;
        this.setState({
            deltaPosition3: {
                x: x + ui.deltaX,
                y: y + ui.deltaY,
            }
        });
    }

    handleDrag4(e, ui) {
        const {x, y} = this.state.deltaPosition4;
        this.setState({
            deltaPosition4: {
                x: x + ui.deltaX,
                y: y + ui.deltaY,
            }
        });
    }

    handleDrag5(e, ui) {
        const {x, y} = this.state.deltaPosition5;
        this.setState({
            deltaPosition5: {
                x: x + ui.deltaX,
                y: y + ui.deltaY,
            }
        });
    }

    handleDrag6(e, ui) {
        const {x, y} = this.state.deltaPosition6;
        this.setState({
            deltaPosition6: {
                x: x + ui.deltaX,
                y: y + ui.deltaY,
            }
        });
    }

    handleDrag7(e, ui) {
        const {x, y} = this.state.deltaPosition7;
        this.setState({
            deltaPosition7: {
                x: x + ui.deltaX,
                y: y + ui.deltaY,
            }
        });
    }

    handleDrag8(e, ui) {
        const {x, y} = this.state.deltaPosition8;
        this.setState({
            deltaPosition8: {
                x: x + ui.deltaX,
                y: y + ui.deltaY,
            }
        });
    }

    handleDrag9(e, ui) {
        const {x, y} = this.state.deltaPosition9;
        this.setState({
            deltaPosition9: {
                x: x + ui.deltaX,
                y: y + ui.deltaY,
            }
        });
    }

    handleDrag90(e, ui) {
        const {x, y} = this.state.deltaPosition90;
        this.setState({
            deltaPosition90: {
                x: x + ui.deltaX,
                y: y + ui.deltaY,
            }
        });
    }

    handleDrag91(e, ui) {
        const {x, y} = this.state.deltaPosition91;
        this.setState({
            deltaPosition91: {
                x: x + ui.deltaX,
                y: y + ui.deltaY,
            }
        });
    }

    onStart() {
        this.setState({activeDrags: ++this.state.activeDrags});
    }

    onStop() {
        this.setState({activeDrags: --this.state.activeDrags});
    }

    // For controlled component
    adjustXPos(e) {
        e.preventDefault();
        e.stopPropagation();
        const {x, y} = this.state.controlledPosition;
        this.setState({controlledPosition: {x: x - 10, y}});
    }

    adjustYPos(e) {
        e.preventDefault();
        e.stopPropagation();
        const {controlledPosition} = this.state;
        const {x, y} = controlledPosition;
        this.setState({controlledPosition: {x, y: y - 10}});
    }

    onControlledDrag(e, position) {
        const {x, y} = position;
        this.setState({controlledPosition: {x, y}});
    }

    onControlledDragStop(e, position) {
        this.onControlledDrag(e, position);
        this.onStop();
    }

    handleChange1(event) {
        this.setState({name1: event.target.value});
    }
    handleChange2(event) {
        this.setState({name2: event.target.value});
    }
    handleChange3(event) {
        this.setState({name3: event.target.value});
    }
    handleChange4(event) {
        this.setState({name4: event.target.value});
    }
    handleChange5(event) {
        this.setState({name5: event.target.value});
    }
    handleChange6(event) {
        this.setState({name6: event.target.value});
    }
    handleChange7(event) {
        this.setState({name7: event.target.value});
    }
    handleChange8(event) {
        this.setState({name8: event.target.value});
    }
    handleChange9(event) {
        this.setState({name9: event.target.value});
    }
    handleChange90(event) {
        this.setState({name90: event.target.value});
    }
    handleChange91(event) {
        this.setState({name91: event.target.value});
    }
    toggleModal() {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }
    renderRoster() {

        console.log(this.state);

        return this.state.teamInfo.members.map((player,i) => (

            <li key={i} className="list-group-item">

                <ul className="list-group" style={{maxHeight: "500px", overflowY: "scroll"}}>
                    <li className="list-group-item">
                        <div className="row">
                            <div className="col-xs-6">
                                <img src="http://via.placeholder.com/120x120" alt="placeholder"/>
                            </div>
                            <div className="col-xs-6">
                                <div className="col-xs-12">
                                    {player.name}
                                </div>
                                <div className="col-xs-12">
                                    {player.email}
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </li>

        ))


    }

    render() {
        const dragHandlers = {onStart: this.onStart, onStop: this.onStop};
        const deltasCss = {delta1: this.state.deltas[0], delta2: this.state.deltas[1],delta3: this.state.deltas[2], delta4: this.state.deltas[3],delta5: this.state.deltas[4], delta6: this.state.deltas[5],delta7: this.state.deltas[6], delta8: this.state.deltas[7],delta9: this.state.deltas[8],delta90: this.state.deltas[9],delta91: this.state.deltas[10]};
        {console.log(deltasCss)}
        const {deltaPosition1, deltaPosition2,deltaPosition3, deltaPosition4,deltaPosition5, deltaPosition6, deltaPosition7, deltaPosition8, deltaPosition9, deltaPosition90,deltaPosition91, controlledPosition} = this.state;
        //const fieldUrl = "../../public/images/soccer-field-background.jpg";
        const fieldUrl = "https://static.vecteezy.com/system/resources/previews/000/104/368/non_2x/free-soccer-field-vector.jpg";
        const styles = {
            box1: {
                background: "rgba(255, 255, 255, 0)",
                //border: "1px solid #999",
                borderRadius: "3px",
                width: "70px",
                height: "70px",
                //margin: "10px",
                padding: "0px",
                float: "left",
                position: "relative",
                top: deltasCss.delta1.y,
                left: deltasCss.delta1.x
            },
            box2: {
                background: "rgba(255, 255, 255, 0)",
                //border: "1px solid #999",
                borderRadius: "3px",
                width: "70px",
                height: "70px",
                //margin: "10px",
                padding: "0px",
                float: "left",
                position: "relative",
                top: deltasCss.delta2.y,
                left: deltasCss.delta2.x
            },
            box3: {
                background: "rgba(255, 255, 255, 0)",
                //border: "1px solid #999",
                borderRadius: "3px",
                width: "70px",
                height: "70px",
                //margin: "10px",
                padding: "0px",
                float: "left",
                position: "relative",
                top: deltasCss.delta3.y,
                left: deltasCss.delta3.x
            },
            box4: {
                background: "rgba(255, 255, 255, 0)",
                //border: "1px solid #999",
                borderRadius: "3px",
                width: "70px",
                height: "70px",
                //margin: "10px",
                padding: "0px",
                float: "left",
                position: "relative",
                top: deltasCss.delta4.y,
                left: deltasCss.delta4.x
            },
            box5: {
                background: "rgba(255, 255, 255, 0)",
                //border: "1px solid #999",
                borderRadius: "3px",
                width: "70px",
                height: "70px",
                //margin: "10px",
                padding: "0px",
                float: "left",
                position: "relative",
                top: deltasCss.delta5.y,
                left: deltasCss.delta5.x
            },
            box6: {
                background: "rgba(255, 255, 255, 0)",
                //border: "1px solid #999",
                borderRadius: "3px",
                width: "70px",
                height: "70px",
                //margin: "10px",
                padding: "0px",
                float: "left",
                position: "relative",
                top: deltasCss.delta6.y,
                left: deltasCss.delta6.x
            },
            box7: {
                background: "rgba(255, 255, 255, 0)",
                //border: "1px solid #999",
                borderRadius: "3px",
                width: "70px",
                height: "70px",
                //margin: "10px",
                padding: "0px",
                float: "left",
                position: "relative",
                top: deltasCss.delta7.y,
                left: deltasCss.delta7.x
            },
            box8: {
                background: "rgba(255, 255, 255, 0)",
                //border: "1px solid #999",
                borderRadius: "3px",
                width: "70px",
                height: "70px",
                //margin: "10px",
                padding: "0px",
                float: "left",
                position: "relative",
                top: deltasCss.delta8.y,
                left: deltasCss.delta8.x
            },
            box9: {
                background: "rgba(255, 255, 255, 0)",
                //border: "1px solid #999",
                borderRadius: "3px",
                width: "70px",
                height: "70px",
                //margin: "10px",
                padding: "0px",
                float: "left",
                position: "relative",
                top: deltasCss.delta9.y,
                left: deltasCss.delta9.x
            },
            box10: {
                background: "rgba(255, 255, 255, 0)",
                //border: "1px solid #999",
                borderRadius: "3px",
                width: "70px",
                height: "70px",
                //margin: "10px",
                padding: "0px",
                float: "left",
                position: "relative",
                top: deltasCss.delta90.y,
                left: deltasCss.delta90.x
            },
            box11: {
                background: "rgba(255, 255, 255, 0)",
                //border: "1px solid #999",
                borderRadius: "3px",
                width: "70px",
                height: "70px",
                //margin: "10px",
                padding: "0px",
                float: "left",
                position: "relative",
                top: deltasCss.delta91.y,
                left: deltasCss.delta91.x
            },
            deleteStyle: {
                cursor: "pointer",
                marginLeft: 5,
                color: "red",
                float: "right"
            },
            inputStyle: {
                width: "70px",
                height: "20px",
                fontSize: "small",
                color: "white",
                textAlign: "center",
                backgroundColor: "black",
                borderRadius: "5px",
                border: "none",
                boxShadow: "none"
            }
        };
        return (
            <div className="container-fluid">

                {this.state.loading ?

                    <div>
                        loading...
                    </div>

                    :


                    this.state.manager ?
                    <div>
                        <ModalTeam show={this.state.isOpen}
                                   onClose={this.toggleModal}>
                            <ul className="list-group">
                                {this.renderRoster()}
                            </ul>
                            <div className="form-group">
                                <div>
                                    <button type="cancel" className="btn btn-default" onClick={this.toggleModal}>Cancel</button>
                                </div>
                            </div>
                        </ModalTeam>
                        <nav style={{marginBottom: "20px"}} className="navbar navbar-inverse">
                            <div className="container-fluid">
                                <div className="navbar-header">
                                    <Link className="navbar-brand" to="/">Sunday League MGMT</Link>
                                </div>
                                <ul className="nav navbar-nav">
                                    <li className={location.pathname === "/" && "active"}>
                                        <Link to="/">Home</Link>
                                    </li>
                                </ul>
                                <ul className="nav navbar-nav" >
                                    <li className={location.pathname === ("/calendar/"+this.state.teamId) && "active"}>
                                        <Link to={"/calendar/"+this.state.teamId}>Calendar</Link>
                                    </li>
                                </ul>
                                <ul className="nav navbar-nav">
                                    <li>
                                        <a onClick={this.toggleModal}>Roster</a>
                                    </li>
                                </ul>
                                <ul className="nav navbar-nav">
                                    <li className={location.pathname === "/" && "active"}>
                                        <Link to="/">League Info</Link>
                                    </li>
                                </ul>
                                <ul className="nav navbar-nav navbar-right">
                                    <li>
                                        <a onClick={this.logout} style={{cursor: "pointer"}}>Logout</a>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                        <div className="row">
                            <div className="col-xs-12 col-sm-6">
                                <div className="panel panel-default">
                                    <div className="panel-heading">
                                        {this.state.teamInfo.name}
                                        <p> - invite your friends, share the team's code: {this.state.teamId}</p>
                                        <CopyToClipboard text={this.state.teamId}
                                                         onCopy={() => this.setState({copied: true})}>
                                            <button className="btn btn-default">Copy to clipboard</button>
                                        </CopyToClipboard>
                                    </div>
                                    {this.state.nextEvent ?

                                        <div className="panel-body">
                                            <h6>What</h6>
                                            <p>{this.state.nextEvent.title}</p>
                                            <h6>When</h6>
                                            <p>{moment(new Date(this.state.nextEvent.start)).format("dddd, MMMM Do YYYY, h:mm:ss a")}</p>
                                            <h6>Additional comments</h6>
                                            <p>{this.state.nextEvent.notes}</p>
                                            <div className="col-sm-offset-2 col-sm-10">
                                                {this.state.confirmed ?
                                                    <p>You are attending this event</p>
                                                    :
                                                    <button className="btn btn-default" onClick={this.handleConfirm}>Confirm
                                                        Attendance
                                                    </button>
                                                }
                                            </div>
                                        </div>

                                        :

                                        <div className="panel-body">
                                            No future events scheduled
                                        </div>

                                    }
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6">
                                <div className="panel panel-default">
                                    <div className="panel-heading">Confirmed to go</div>
                                    {this.state.nextEvent ?

                                        <div className="panel-body">
                                            {
                                                this.state.participants.map((participant,i) => (
                                                    <div key={i}>
                                                        <p>{participant.name}</p>
                                                    </div>
                                                ))

                                            }
                                        </div>

                                        :

                                        <div className="panel-body">
                                            No future events scheduled
                                        </div>

                                    }
                                </div>
                            </div>
                        </div>

                        <div style={{height: "530px",width: "700px", position: 'relative', overflowX: 'scroll', padding: '0px', margin: "auto"}}>
                            <button className="btn btn-success" onClick={this.handleConfirmLineup}>Save Lineup
                            </button>
                            <div style={{height: "530px",width: "700px", padding: '0px', backgroundImage: 'url(' + fieldUrl + ')', borderRadius: "3px"}}>
                                <Draggable onDrag={this.handleDrag1} bounds="parent" {...dragHandlers}>
                                    <div style={styles.box1}>
                                        <img style={{width:"70px", height:"70px"}} src={"https://cdn4.iconfinder.com/data/icons/football-4/100/jersey_3-512.png"} alt="a soccer player"/>
                                        <input onChange={this.handleChange1} value={this.state.name1} style={styles.inputStyle} type="text" />
                                    </div>
                                </Draggable>
                                <Draggable onDrag={this.handleDrag2} bounds="parent" {...dragHandlers}>
                                    <div style={styles.box2}>
                                        <img style={{width:"70px", height:"70px"}} src={"https://cdn4.iconfinder.com/data/icons/football-4/100/jersey_3-512.png"} alt="a soccer player"/>
                                        <input onChange={this.handleChange2} value={this.state.name2} style={styles.inputStyle} type="text" />
                                    </div>
                                </Draggable>
                                <Draggable onDrag={this.handleDrag3} bounds="parent" {...dragHandlers}>
                                    <div style={styles.box3}>
                                        <img style={{width:"70px", height:"70px"}} src={"https://cdn4.iconfinder.com/data/icons/football-4/100/jersey_3-512.png"} alt="a soccer player"/>
                                        <input onChange={this.handleChange3} value={this.state.name3} style={styles.inputStyle} type="text" />
                                    </div>
                                </Draggable>
                                <Draggable onDrag={this.handleDrag4} bounds="parent" {...dragHandlers}>
                                    <div style={styles.box4}>
                                        <img style={{width:"70px", height:"70px"}} src={"https://cdn4.iconfinder.com/data/icons/football-4/100/jersey_3-512.png"} alt="a soccer player"/>
                                        <input onChange={this.handleChange4} value={this.state.name4} style={styles.inputStyle} type="text" />
                                    </div>
                                </Draggable>
                                <Draggable onDrag={this.handleDrag5} bounds="parent" {...dragHandlers}>
                                    <div style={styles.box5}>
                                        <img style={{width:"70px", height:"70px"}} src={"https://cdn4.iconfinder.com/data/icons/football-4/100/jersey_3-512.png"} alt="a soccer player"/>
                                        <input onChange={this.handleChange5} value={this.state.name5} style={styles.inputStyle} type="text" />
                                    </div>
                                </Draggable>
                                <Draggable onDrag={this.handleDrag6} bounds="parent" {...dragHandlers}>
                                    <div style={styles.box6}>
                                        <img style={{width:"70px", height:"70px"}} src={"https://cdn4.iconfinder.com/data/icons/football-4/100/jersey_3-512.png"} alt="a soccer player"/>
                                        <input onChange={this.handleChange6} value={this.state.name6} style={styles.inputStyle} type="text" />
                                    </div>
                                </Draggable>
                                <Draggable onDrag={this.handleDrag7} bounds="parent" {...dragHandlers}>
                                    <div style={styles.box7}>
                                        <img style={{width:"70px", height:"70px"}} src={"https://cdn4.iconfinder.com/data/icons/football-4/100/jersey_3-512.png"} alt="a soccer player"/>
                                        <input onChange={this.handleChange7} value={this.state.name7} style={styles.inputStyle} type="text" />
                                    </div>
                                </Draggable>
                                <Draggable onDrag={this.handleDrag8} bounds="parent" {...dragHandlers}>
                                    <div style={styles.box8}>
                                        <img style={{width:"70px", height:"70px"}} src={"https://cdn4.iconfinder.com/data/icons/football-4/100/jersey_3-512.png"} alt="a soccer player"/>
                                        <input onChange={this.handleChange8} value={this.state.name8} style={styles.inputStyle} type="text" />
                                    </div>
                                </Draggable>
                                <Draggable onDrag={this.handleDrag9} bounds="parent" {...dragHandlers}>
                                    <div style={styles.box9}>
                                        <img style={{width:"70px", height:"70px"}} src={"https://cdn4.iconfinder.com/data/icons/football-4/100/jersey_3-512.png"} alt="a soccer player"/>
                                        <input onChange={this.handleChange9} value={this.state.name9} style={styles.inputStyle} type="text" />
                                    </div>
                                </Draggable>
                                <Draggable onDrag={this.handleDrag90} bounds="parent" {...dragHandlers}>
                                    <div style={styles.box10}>
                                        <img style={{width:"70px", height:"70px"}} src={"https://cdn4.iconfinder.com/data/icons/football-4/100/jersey_3-512.png"} alt="a soccer player"/>
                                        <input onChange={this.handleChange90} value={this.state.name90} style={styles.inputStyle} type="text" />
                                    </div>
                                </Draggable>
                                <Draggable onDrag={this.handleDrag91} bounds="parent" {...dragHandlers}>
                                    <div style={styles.box11}>
                                        <img style={{width:"70px", height:"70px"}} src={"https://cdn4.iconfinder.com/data/icons/football-4/100/jersey_3-512.png"} alt="a soccer player"/>
                                        <input onChange={this.handleChange91} value={this.state.name91} style={styles.inputStyle} type="text" />
                                    </div>
                                </Draggable>
                            </div>
                        </div>
                    </div>
                    :

                    <div>
                        <nav style={{marginBottom: "20px"}} className="navbar navbar-inverse">
                            <div className="container-fluid">
                                <div className="navbar-header">
                                    <Link className="navbar-brand" to="/">Sunday League MGMT</Link>
                                </div>
                                <ul className="nav navbar-nav">
                                    <li className={location.pathname === "/" && "active"}>
                                        <Link to="/">Home</Link>
                                    </li>
                                </ul>
                                <ul className="nav navbar-nav" >
                                    <li className={location.pathname === ("/calendar/"+this.state.teamId) && "active"}>
                                        <Link to={"/calendar/"+this.state.teamId}>Calendar</Link>
                                    </li>
                                </ul>
                                <ul className="nav navbar-nav">
                                    <li>
                                        <a onClick={this.toggleModal}>Roster</a>
                                    </li>
                                </ul>
                                <ul className="nav navbar-nav">
                                    <li className={location.pathname === "/" && "active"}>
                                        <Link to="/">League Info</Link>
                                    </li>
                                </ul>
                                <ul className="nav navbar-nav navbar-right">
                                    <li>
                                        <a onClick={this.logout} style={{cursor: "pointer"}}>Logout</a>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                        <div>
                            <ModalTeam show={this.state.isOpen}
                                       onClose={this.toggleModal}>
                                <ul className="list-group">
                                    {this.renderRoster()}
                                </ul>
                                <div className="form-group">
                                    <div className="col-lg-10 col-lg-offset-2">
                                        <button type="cancel" className="btn btn-default" onClick={this.toggleModal}>Cancel</button>
                                    </div>
                                </div>
                            </ModalTeam>
                        </div>
                        <div className="col-xs-12 col-sm-6">
                            <div className="panel panel-default">
                                <div className="panel-heading">{this.state.teamInfo.name}</div>
                                {this.state.nextEvent ?

                                    <div className="panel-body">
                                        <h6>What</h6>
                                        <p>{this.state.nextEvent.title}</p>
                                        <h6>When</h6>
                                        <p>{moment(new Date(this.state.nextEvent.start)).format("dddd, MMMM Do YYYY, h:mm:ss a")}</p>
                                        <h6>Additional comments</h6>
                                        <p>{this.state.nextEvent.notes}</p>
                                        <div>
                                            {this.state.confirmed ?
                                                <p>You are attending this event</p>
                                                :
                                                <button className="btn btn-default" onClick={this.handleConfirm}>Confirm
                                                    Attendance
                                                </button>
                                            }
                                        </div>
                                    </div>

                                    :

                                    <div className="panel-body">
                                        No future events scheduled
                                    </div>

                                }
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6">
                            <div className="panel panel-default">
                                <div className="panel-heading">Confirmed to go</div>
                                {this.state.nextEvent ?

                                    <div className="panel-body">
                                        {
                                            this.state.participants.map((participant,i) => (
                                                <div key={i}>
                                                    <p>{participant.name}</p>
                                                </div>
                                            ))

                                        }
                                    </div>

                                    :

                                    <div className="panel-body">
                                        No future events scheduled
                                    </div>

                                }
                            </div>
                        </div>

                        <div style={{height: "530px",width: "700px", position: 'relative', overflowX: 'scroll', padding: '0px', margin: "auto"}}>
                            <div style={{height: "530px",width: "700px", padding: '0px', backgroundImage: 'url(' + fieldUrl + ')', borderRadius: "3px"}}>

                                {/*color: white;
                                 text-align: center;
                                 margin: 0;
                                 background-color: black;
                                 border-radius: 9px;*/}

                                <div style={styles.box1}>
                                    <img style={{width:"70px", height:"70px"}} src={"https://cdn4.iconfinder.com/data/icons/football-4/100/jersey_3-512.png"} alt="a soccer player"/>
                                    <p style={{color: "white", textAlign: "center", margin: 0, backgroundColor: "black", borderRadius: "5px"}}>{this.state.name1}</p>
                                </div>
                                <div style={styles.box2}>
                                    <img style={{width:"70px", height:"70px"}} src={"https://cdn4.iconfinder.com/data/icons/football-4/100/jersey_3-512.png"} alt="a soccer player"/>
                                    <p style={{color: "white", textAlign: "center", margin: 0, backgroundColor: "black", borderRadius: "5px"}}>{this.state.name2}</p>
                                </div>
                                <div style={styles.box3}>
                                    <img style={{width:"70px", height:"70px"}} src={"https://cdn4.iconfinder.com/data/icons/football-4/100/jersey_3-512.png"} alt="a soccer player"/>
                                    <p style={{color: "white", textAlign: "center", margin: 0, backgroundColor: "black", borderRadius: "5px"}}>{this.state.name3}</p>
                                </div>
                                <div style={styles.box4}>
                                    <img style={{width:"70px", height:"70px"}} src={"https://cdn4.iconfinder.com/data/icons/football-4/100/jersey_3-512.png"} alt="a soccer player"/>
                                    <p style={{color: "white", textAlign: "center", margin: 0, backgroundColor: "black", borderRadius: "5px"}}>{this.state.name4}</p>
                                </div>
                                <div style={styles.box5}>
                                    <img style={{width:"70px", height:"70px"}} src={"https://cdn4.iconfinder.com/data/icons/football-4/100/jersey_3-512.png"} alt="a soccer player"/>
                                    <p style={{color: "white", textAlign: "center", margin: 0, backgroundColor: "black", borderRadius: "5px"}}>{this.state.name5}</p>
                                </div>
                                <div style={styles.box6}>
                                    <img style={{width:"70px", height:"70px"}} src={"https://cdn4.iconfinder.com/data/icons/football-4/100/jersey_3-512.png"} alt="a soccer player"/>
                                    <p style={{color: "white", textAlign: "center", margin: 0, backgroundColor: "black", borderRadius: "5px"}}>{this.state.name6}</p>
                                </div>
                                <div style={styles.box7}>
                                    <img style={{width:"70px", height:"70px"}} src={"https://cdn4.iconfinder.com/data/icons/football-4/100/jersey_3-512.png"} alt="a soccer player"/>
                                    <p style={{color: "white", textAlign: "center", margin: 0, backgroundColor: "black", borderRadius: "5px"}}>{this.state.name7}</p>
                                </div>
                                <div style={styles.box8}>
                                    <img style={{width:"70px", height:"70px"}} src={"https://cdn4.iconfinder.com/data/icons/football-4/100/jersey_3-512.png"} alt="a soccer player"/>
                                    <p style={{color: "white", textAlign: "center", margin: 0, backgroundColor: "black", borderRadius: "5px"}}>{this.state.name8}</p>
                                </div>
                                <div style={styles.box9}>
                                    <img style={{width:"70px", height:"70px"}} src={"https://cdn4.iconfinder.com/data/icons/football-4/100/jersey_3-512.png"} alt="a soccer player"/>
                                    <p style={{color: "white", textAlign: "center", margin: 0, backgroundColor: "black", borderRadius: "5px"}}>{this.state.name9}</p>
                                </div>
                                <div style={styles.box10}>
                                    <img style={{width:"70px", height:"70px"}} src={"https://cdn4.iconfinder.com/data/icons/football-4/100/jersey_3-512.png"} alt="a soccer player"/>
                                    <p style={{color: "white", textAlign: "center", margin: 0, backgroundColor: "black", borderRadius: "5px"}}>{this.state.name90}</p>
                                </div>
                                <div style={styles.box11}>
                                    <img style={{width:"70px", height:"70px"}} src={"https://cdn4.iconfinder.com/data/icons/football-4/100/jersey_3-512.png"} alt="a soccer player"/>
                                    <p style={{color: "white", textAlign: "center", margin: 0, backgroundColor: "black", borderRadius: "5px"}}>{this.state.name91}</p>
                                </div>


                            </div>
                        </div>

                    </div>
                }
            </div>

        )


    }
}



export default Team;