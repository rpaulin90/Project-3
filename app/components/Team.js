/**
 * Created by rpaulin on 8/2/17.
 */
import React, { Component } from "react";
import firebase, { auth } from '../firebase.js';
import API from "../utils/API";
import { Link, withRouter } from "react-router";
import moment from 'moment';


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
            user: null // <-- add this line

        };

        this.logout = this.logout.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
        //this.handleUnConfirm = this.handleUnConfirm.bind(this);

    }

    componentDidMount() {

        console.dir(this.props);
        this.fireBaseListener = auth.onAuthStateChanged((user) => {
            if (user) {
                const uid = auth.currentUser.uid;

                API.getCalendarInfo(uid, this.props.params.id).then((res) => {
                    console.log("res.data[1][0]");
                    console.log(res.data[1][0]);
                    console.log("res");
                    console.log(res);
                    var nextEvent;
                    if(res.data[1][0].calendarGames.length === 0){
                        nextEvent = false
                    }else{
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
                            confirmed: res.data[0][0].confirmed
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
                                    confirmed: res.data[0][0].confirmed
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
                                    confirmed: res.data[0][0].confirmed
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
            for(let x = 0; x < res.data[1].calendarGames.length ; x++){
                if(res.data[1].calendarGames[x].id === this.state.nextEvent.id){

                    this.setState({nextEvent: res.data[1].calendarGames[x], confirmed: true})

                }
            }

        });
        //this.setState({ inputValueCode: "" });


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

    render() {
        return (
            <div>
                {this.state.manager ?
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
                                            this.state.nextEvent.participants.map((participant,i) => (
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
                        <div className="col-xs-12" style={{
                            textAlign: "-webkit-center"
                        }}>
                            <div style={{border: "1px solid black", height: "750px",width: "600px",backgroundColor:"green"}}>

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
                                            this.state.nextEvent.participants.map((participant,i) => (
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
                        <div className="col-xs-12" style={{
                            textAlign: "-webkit-center"
                        }}>
                            <div style={{border: "1px solid black", height: "750px",width: "600px",backgroundColor:"green"}}>

                            </div>
                        </div>
                    </div>
                }
            </div>

        )


    }
}



export default Team;