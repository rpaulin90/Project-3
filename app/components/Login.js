/**
 * Created by rpaulin on 7/31/17.
 */
import React, { Component } from "react";
import { Link } from "react-router";
// import Panel from "./common/Panel";
// import QuoteForm from "./common/QuoteForm";
import firebase, { auth } from '../firebase.js';
import API from "../utils/API";
import ManagedTeam from "./common/ManagedTeam";

class Login extends Component {

    constructor() {
        super();
        this.state = {
            inputValueName: "",
            inputValueEmail: "",
            inputValuePwd: "",
            inputValueTeam: "",
            currentUid:"",
            managedTeams:[],
            notManagedTeams: [],
            count: 0,
            user: null // <-- add this line
        };
        // Binding handleInputChange and handleButtonClick since we'll be passing them as
        // callbacks and 'this' will change otherwise
        this.handleInputChangeName = this.handleInputChangeName.bind(this);
        this.handleInputChangeEmail = this.handleInputChangeEmail.bind(this);
        this.handleInputChangePwd = this.handleInputChangePwd.bind(this);
        this.handleInputChangeTeam = this.handleInputChangeTeam.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.handleCreateTeam = this.handleCreateTeam.bind(this);
        this.getTeams = this.getTeams.bind(this);
        this.logout = this.logout.bind(this);
    }
    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                let that = this;
                const uid = auth.currentUser.uid;
                API.getUserInfo(uid).then((res) => {
                    this.setState({user, currentUid: auth.currentUser.uid, managedTeams:res.data[0].managedTeams, notManagedTeams: res.data[0].notManagedTeams});
                });

            }
        });
    }
    handleInputChangeName(event) {
        this.setState({ inputValueName: event.target.value });
    }
    handleInputChangeEmail(event) {
        this.setState({ inputValueEmail: event.target.value });
    }
    handleInputChangePwd(event) {
        this.setState({ inputValuePwd: event.target.value });
    }
    handleInputChangeTeam(event) {
        this.setState({ inputValueTeam: event.target.value });
    }
    handleButtonClick(event) {
        var that = this;
        event.preventDefault();
        auth.createUserWithEmailAndPassword(that.state.inputValueEmail, that.state.inputValuePwd).then(function () {
            console.log("user registered with email: " + that.state.inputValueEmail);
            const userName = that.state.inputValueName;
            const userEmail = that.state.inputValueEmail;
            const uid = auth.currentUser.uid;
            const managedTeams = [];
            const notManagedTeams = [];
            API.newUser(userName,userEmail,uid, managedTeams, notManagedTeams).then(console.log("sent to database"));
            that.setState({ inputValueName: "",inputValueEmail: "", inputValuePwd: "" });

        }).catch(function (error) {

            if (error) {
                console.log("something went wrong");
                console.log(error)
            }

        });

    }
    handleCreateTeam(event) {

        const that = this;
        event.preventDefault();
        const team = this.state.inputValueTeam;


        API.newTeam(this.state.currentUid, team).then(this.getTeams());
        this.setState({ inputValueTeam: "" });


    }
    logout(event) {
        var that = this;
        event.preventDefault();
        auth.signOut()
            .then(() => {
                that.setState({
                    user: null,
                    currentUid: ""
                });
            });

    }

    getTeams() {
        API.getUserInfo(this.state.currentUid).then((res) => {
            this.setState({ managedTeams: res.data[0].managedTeams, notManagedTeams: res.data[0].notManagedTeams });
        });
    }

    renderTeams() {

        return this.state.managedTeams.map(team => (
            <ManagedTeam
                team={team}
                key={team}
                getTeams={this.getTeams}
            />
        ));

    }
    render() {
        return (

            <div className="container">
                {this.state.user ?

                    <div className='wrapper'>
                        <nav style={{ marginBottom: "20px" }} className="navbar navbar-inverse">
                            <div className="container-fluid">
                                <div className="navbar-header">
                                    <Link className="navbar-brand" to="/">Sunday League MGMT</Link>
                                </div>
                                <ul className="nav navbar-nav">
                                    <li className={location.pathname === "/" && "active"}>
                                        <Link to="/">Home</Link>
                                    </li>
                                </ul>
                                <ul className="nav navbar-nav navbar-right">
                                    <li>
                                        <a onClick={this.logout}>Logout</a>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                        <div className="row">
                            <div className="col-xs-4">
                                <div className="panel panel-default">
                                    <div className="panel-body">
                                        My Teams
                                    </div>
                                    <div>
                                        <hr />
                                        {this.renderTeams()}
                                    </div>
                                </div>
                            </div>
                            <div className="col-xs-4">
                                <div className="panel panel-default">
                                    <div className="panel-body">
                                        Create a Team
                                        <form>
                                            <label className="control-label col-sm-2">Team Name:</label>
                                            <div className="col-sm-10">
                                                <input onChange={this.handleInputChangeTeam} value={this.state.inputValueTeam}  className="form-control" id="name" placeholder="Enter new team's name"/>
                                            </div>
                                        </form>
                                        <div className="form-group">
                                            <div className="col-sm-offset-2 col-sm-10">
                                                <button className="btn btn-default" onClick={this.handleCreateTeam}>Submit</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xs-4">
                                <div className="panel panel-default">
                                    <div className="panel-body">
                                        Join a Team
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    :
                    <div style={{marginTop: "100px"}}>
                        <div className="panel panel-default">
                            <div className="panel-body">
                                <h2>Horizontal form</h2>
                                <form className="form-horizontal">
                                    <div className="form-group">
                                        <label className="control-label col-sm-2">Name:</label>
                                        <div className="col-sm-10">
                                            <input onChange={this.handleInputChangeName} value={this.state.inputValueName}  className="form-control" id="name" placeholder="Enter your name"/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label col-sm-2">Email:</label>
                                        <div className="col-sm-10">
                                            <input onChange={this.handleInputChangeEmail} value={this.state.inputValueEmail} type="email" className="form-control" id="email" placeholder="Enter email" name="email"/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label col-sm-2">Password:</label>
                                        <div className="col-sm-10">
                                            <input onChange={this.handleInputChangePwd} value={this.state.inputValuePwd} type="password" className="form-control" id="pwd" placeholder="Enter password" name="pwd"/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="col-sm-offset-2 col-sm-10">
                                            <button className="btn btn-default" onClick={this.handleButtonClick}>Submit</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="panel-footer">
                                <span id="go_to_login"><a href="">Log In</a></span>
                                <span> or </span>
                                <span id="reset_pwd_login"> <a href="">Reset Password</a></span>
                            </div>
                        </div>
                    </div>
                }

            </div>
        );
    }
}

export default Login;
