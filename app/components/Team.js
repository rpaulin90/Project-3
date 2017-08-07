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


class Team extends Component {

    constructor() {
        super();
        this.state = {
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
            }]

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
                            deltas: deltasArray
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
                                    deltas: deltasArray
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
                                    deltas: deltasArray
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


            API.saveLineup(this.state.teamId, newDeltasArray).then((res) => {

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
                position: "absolute",
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
                position: "absolute",
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
                position: "absolute",
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
                position: "absolute",
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
                position: "absolute",
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
                position: "absolute",
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
                position: "absolute",
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
                position: "absolute",
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
                position: "absolute",
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
                position: "absolute",
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
                position: "absolute",
                top: deltasCss.delta91.y,
                left: deltasCss.delta91.x
            },
            deleteStyle: {
                cursor: "pointer",
                marginLeft: 5,
                color: "red",
                float: "right"
            }
        };
        return (
            <div className="container-fluid">
                {this.state.manager ?
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
                                    <li className={location.pathname === "/" && "active"}>
                                        <Link to="/">Roster</Link>
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
                            <div className="col-xs-6">
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
                            <div className="col-xs-6">
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
                        <button className="btn btn-success" onClick={this.handleConfirmLineup}>Save Lineup
                        </button>
                        <div style={{height: "100%",width: "100%", position: 'relative', overflowX: 'scroll', padding: '0px', float:"left"}}>
                            <div style={{height: "530px",width: "700px", padding: '0px', backgroundImage: 'url(' + fieldUrl + ')', borderRadius: "3px"}}>
                                <Draggable onDrag={this.handleDrag1} bounds="parent" {...dragHandlers}>
                                    <img style={styles.box1} src={"https://cdn4.iconfinder.com/data/icons/football-4/100/jersey_3-512.png"} alt="a soccer player"/>
                                </Draggable>
                                <Draggable onDrag={this.handleDrag2} bounds="parent" {...dragHandlers}>
                                    <img style={styles.box2} src={"https://cdn4.iconfinder.com/data/icons/football-4/100/jersey_3-512.png"} alt="a soccer player"/>
                                </Draggable>
                                <Draggable onDrag={this.handleDrag3} bounds="parent" {...dragHandlers}>
                                    <img style={styles.box3} src={"https://cdn4.iconfinder.com/data/icons/football-4/100/jersey_3-512.png"} alt="a soccer player"/>
                                </Draggable>
                                <Draggable onDrag={this.handleDrag4} bounds="parent" {...dragHandlers}>
                                    <img style={styles.box4} src={"https://cdn4.iconfinder.com/data/icons/football-4/100/jersey_3-512.png"} alt="a soccer player"/>
                                </Draggable>
                                <Draggable onDrag={this.handleDrag5} bounds="parent" {...dragHandlers}>
                                    <img style={styles.box5} src={"https://cdn4.iconfinder.com/data/icons/football-4/100/jersey_3-512.png"} alt="a soccer player"/>
                                </Draggable>
                                <Draggable onDrag={this.handleDrag6} bounds="parent" {...dragHandlers}>
                                    <img style={styles.box6} src={"https://cdn4.iconfinder.com/data/icons/football-4/100/jersey_3-512.png"} alt="a soccer player"/>
                                </Draggable>
                                <Draggable onDrag={this.handleDrag7} bounds="parent" {...dragHandlers}>
                                    <img style={styles.box7} src={"https://cdn4.iconfinder.com/data/icons/football-4/100/jersey_3-512.png"} alt="a soccer player"/>
                                </Draggable>
                                <Draggable onDrag={this.handleDrag8} bounds="parent" {...dragHandlers}>
                                    <img style={styles.box8} src={"https://cdn4.iconfinder.com/data/icons/football-4/100/jersey_3-512.png"} alt="a soccer player"/>
                                </Draggable>
                                <Draggable onDrag={this.handleDrag9} bounds="parent" {...dragHandlers}>
                                    <img style={styles.box9} src={"https://cdn4.iconfinder.com/data/icons/football-4/100/jersey_3-512.png"} alt="a soccer player"/>
                                </Draggable>
                                <Draggable onDrag={this.handleDrag90} bounds="parent" {...dragHandlers}>
                                    <img style={styles.box10} src={"https://cdn4.iconfinder.com/data/icons/football-4/100/jersey_3-512.png"} alt="a soccer player"/>
                                </Draggable>
                                <Draggable onDrag={this.handleDrag91} bounds="parent" {...dragHandlers}>
                                    <img style={styles.box11} src={"https://cdn4.iconfinder.com/data/icons/football-4/100/jersey_3-512.png"} alt="a soccer player"/>
                                </Draggable>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="container">
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
                                    <li className={location.pathname === "/" && "active"}>
                                        <Link to="/">Roster</Link>
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
                        <div className="col-xs-6">
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
                        <div className="col-xs-6">
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

                        <div style={{height: "100%",width: "100%", position: 'relative', overflowX: 'scroll', padding: '0px', float:"left"}}>
                            <div style={{height: "530px",width: "700px", padding: '0px', backgroundImage: 'url(' + fieldUrl + ')', borderRadius: "3px"}}>

                                <img style={styles.box1} src={"https://cdn4.iconfinder.com/data/icons/football-4/100/jersey_3-512.png"} alt="a soccer player"/>

                                <img style={styles.box2} src={"https://cdn4.iconfinder.com/data/icons/football-4/100/jersey_3-512.png"} alt="a soccer player"/>
                                <img style={styles.box3} src={"https://cdn4.iconfinder.com/data/icons/football-4/100/jersey_3-512.png"} alt="a soccer player"/>

                                <img style={styles.box4} src={"https://cdn4.iconfinder.com/data/icons/football-4/100/jersey_3-512.png"} alt="a soccer player"/>
                                <img style={styles.box5} src={"https://cdn4.iconfinder.com/data/icons/football-4/100/jersey_3-512.png"} alt="a soccer player"/>

                                <img style={styles.box6} src={"https://cdn4.iconfinder.com/data/icons/football-4/100/jersey_3-512.png"} alt="a soccer player"/>
                                <img style={styles.box7} src={"https://cdn4.iconfinder.com/data/icons/football-4/100/jersey_3-512.png"} alt="a soccer player"/>

                                <img style={styles.box8} src={"https://cdn4.iconfinder.com/data/icons/football-4/100/jersey_3-512.png"} alt="a soccer player"/>
                                <img style={styles.box9} src={"https://cdn4.iconfinder.com/data/icons/football-4/100/jersey_3-512.png"} alt="a soccer player"/>

                                <img style={styles.box10} src={"https://cdn4.iconfinder.com/data/icons/football-4/100/jersey_3-512.png"} alt="a soccer player"/>
                                <img style={styles.box11} src={"https://cdn4.iconfinder.com/data/icons/football-4/100/jersey_3-512.png"} alt="a soccer player"/>

                            </div>
                        </div>

                    </div>
                }
            </div>

        )


    }
}



export default Team;