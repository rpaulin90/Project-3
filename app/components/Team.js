/**
 * Created by rpaulin on 8/2/17.
 */
import React, { Component } from "react";
import firebase, { auth } from '../firebase.js';
import API from "../utils/API";
import { Link, withRouter } from "react-router";


class Team extends Component {

    constructor() {
        super();
        this.state = {
            teamId: "",
            currentUid: "",
            managedTeams: [],
            notManagedTeams: [],
            manager:false,
            user: null // <-- add this line

        };

        this.logout = this.logout.bind(this);

    }

    componentDidMount() {

        console.dir(this.props);
        this.fireBaseListener = auth.onAuthStateChanged((user) => {
            if (user) {
                let that = this;
                const uid = auth.currentUser.uid;
                API.getUserInfo(uid).then((res) => {
                    if(res.data[0].managedTeams.length === 0){
                        this.setState({
                            user,
                            currentUid: auth.currentUser.uid,
                            managedTeams: res.data[0].managedTeams,
                            notManagedTeams: res.data[0].notManagedTeams,
                            teamId: this.props.params.id,
                            manager: false
                        });
                    }else{
                        for(var x = 0; x < res.data[0].managedTeams.length; x++){
                            if(res.data[0].managedTeams[x]._id === this.props.params.id){

                                this.setState({
                                    user,
                                    currentUid: auth.currentUser.uid,
                                    managedTeams: res.data[0].managedTeams,
                                    notManagedTeams: res.data[0].notManagedTeams,
                                    teamId: this.props.params.id,
                                    manager: true
                                });
                                return

                            }else{
                                this.setState({
                                    user,
                                    currentUid: auth.currentUser.uid,
                                    managedTeams: res.data[0].managedTeams,
                                    notManagedTeams: res.data[0].notManagedTeams,
                                    teamId: this.props.params.id,
                                    manager: false
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
                        <div className="col-xs-12">
                            <div className="panel panel-default">
                                <div className="panel-body">
                                    Information about the next match
                                </div>
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
                        <div className="col-xs-12">
                            <div className="panel panel-default">
                                <div className="panel-body">
                                    Information about the next match
                                </div>
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