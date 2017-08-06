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
            controlledPosition: {
                x: -400, y: 200
            },
            deltas:[{
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
                            attending = false;
                            API.updateNextEvent(nextEvent, this.props.params.id).then((response) => {
                                console.log("updated next event");
                            });
                            participantsArray = [];
                        }
                        else if(res.data[0][0].confirmed === true){
                            attending = true;
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

            let deltas = [this.state.deltaPosition1,this.state.deltaPosition2];

            API.saveLineup(this.state.teamId, deltas).then((res) => {

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
        const deltasCss = {delta1: this.state.deltas[0], delta2: this.state.deltas[1]};
        {console.log(deltasCss)}
        const {deltaPosition1, deltaPosition2, controlledPosition} = this.state;
        const styles = {
            box1: {
                background: "#fff",
                border: "1px solid #999",
                borderRadius: "3px",
                width: "180px",
                height: "180px",
                //margin: "10px",
                padding: "10px",
                float: "left",
                position: "relative",
                top: deltasCss.delta1.y,
                left: deltasCss.delta1.x
            },
            box2: {
                background: "#fff",
                border: "1px solid #999",
                borderRadius: "3px",
                width: "180px",
                height: "180px",
                //margin: "10px",
                padding: "10px",
                float: "left",
                position: "relative",
                top: deltasCss.delta2.y,
                left: deltasCss.delta2.x
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
                        <div style={{height: "100%",width: "100%", position: 'relative', overflowX: 'scroll', padding: '15px', float:"left"}}>
                            <div style={{height: "600px",width: "450px", padding: '10px', backgroundColor:"green"}}>
                                <Draggable onDrag={this.handleDrag1} bounds="parent" {...dragHandlers}>
                                    <div style={styles.box1}>
                                        I can only be moved within my offsetParent.<br /><br />
                                        Both parent padding and child margin work properly.
                                    </div>
                                </Draggable>
                                <Draggable onDrag={this.handleDrag2} bounds="parent" {...dragHandlers}>
                                    <div style={styles.box2}>
                                        I also can only be moved within my offsetParent.<br /><br />
                                        Both parent padding and child margin work properly.
                                    </div>
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

                        <div style={{height: "100%",width: "100%", position: 'relative', overflowX: 'scroll', padding: '15px', float:"left"}}>
                            <div style={{height: "600px",width: "450px", padding: '10px', backgroundColor:"green"}}>

                                    <div style={styles.box1}>
                                        I can only be moved within my offsetParent.<br /><br />
                                        Both parent padding and child margin work properly.
                                    </div>

                                    <div style={styles.box2}>
                                        I also can only be moved within my offsetParent.<br /><br />
                                        Both parent padding and child margin work properly.
                                    </div>

                            </div>
                        </div>
                        {/*<div className="col-xs-12" style={{*/}
                            {/*textAlign: "-webkit-center"*/}
                        {/*}}>*/}
                            {/*<Field*/}

                                {/*handleDrag = {this.handleDrag}*/}
                                {/*onStop = {this.onStop}*/}
                                {/*onStart = {this.onStart}*/}
                                {/*adjustXPos = {this.adjustXPos}*/}
                                {/*adjustYPos = {this.adjustYPos}*/}
                                {/*onControlledDrag = {this.onControlledDrag}*/}
                                {/*onControlledDragStop = {this.onControlledDragStop}*/}
                                {/*activeDrags = {this.state.activeDrags}*/}
                                {/*deltaPosition = {this.state.deltaPosition}*/}
                                {/*controlledPosition = {this.state.controlledPosition}*/}

                            {/*/>*/}
                        {/*</div>*/}
                    </div>
                }
            </div>

        )


    }
}



export default Team;