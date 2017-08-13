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
import NotManagedTeam from "./common/NotManagedTeam";
import RegisterForm from "./common/RegisterForm";


class Login extends Component {

    constructor() {
        super();
        this.state = {
            profilePic: "https://via.placeholder.com/200x200",
            userInfo: "",
            loginForm: "Register",
            inputValueName: "",
            inputValuePhone: "",
            inputValueImage: "",
            inputValueEmail: "",
            inputValuePwd: "",
            inputValueTeam: "",
            inputValueCode: "",
            currentUid:"",
            managedTeams:[],
            notManagedTeams: [],
            count: 0,
            user: null // <-- add this line
        };
        // Binding handleInputChange and handleButtonClick since we'll be passing them as
        // callbacks and 'this' will change otherwise
        
        this.handleInputChangeName = this.handleInputChangeName.bind(this);
        this.handleInputChangePhone = this.handleInputChangePhone.bind(this);
        this.handleInputChangeImage = this.handleInputChangeImage.bind(this);
        this.handleInputChangeEmail = this.handleInputChangeEmail.bind(this);
        this.handleInputChangePwd = this.handleInputChangePwd.bind(this);
        this.handleInputChangeTeam = this.handleInputChangeTeam.bind(this);
        this.handleInputChangeCode = this.handleInputChangeCode.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.handleButtonClickLogin = this.handleButtonClickLogin.bind(this);
        this.handleCreateTeam = this.handleCreateTeam.bind(this);
        this.handleJoinTeam = this.handleJoinTeam.bind(this);
        this.getTeams = this.getTeams.bind(this);
        this.logout = this.logout.bind(this);
        this.changeForm = this.changeForm.bind(this);
        this.getSignedRequestUser = this.getSignedRequestUser.bind(this);
        this.uploadFileUser = this.uploadFileUser.bind(this);
    }
    componentDidMount() {
        this.fireBaseListener = auth.onAuthStateChanged((user) => {
            if (user) {
                let that = this;
                const uid = auth.currentUser.uid;
                API.getUserInfo(uid).then((res) => {
                    console.log(res);
                    this.setState({user, currentUid: auth.currentUser.uid, managedTeams:res.data[0].managedTeams, notManagedTeams: res.data[0].notManagedTeams, userInfo: res.data[0]});
                });

            }
        });
    }
    componentWillUnmount() {
        this.fireBaseListener && this.fireBaseListener();
    }
    handleInputChangeName(event) {
        this.setState({ inputValueName: event.target.value });
    }
    handleInputChangePhone(event) {

        this.setState({ inputValuePhone: event.target.value });
    }
    handleInputChangeImage(event) {
        console.log(event.target.files);
        let file = event.target.files[0];
        this.getSignedRequestUser(file);


    }
    getSignedRequestUser(file){
        const xhr = new XMLHttpRequest();
        let that = this;
        xhr.open('GET', `/sign-s3?file-name=${file.name}&file-type=${file.type}`);
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4){
                if(xhr.status === 200){
                    const response = JSON.parse(xhr.responseText);
                    that.uploadFileUser(file, response.signedRequest, response.url);
                }
                else{
                    alert('Could not get signed URL.');
                }
            }
        }
        xhr.send();
    }
    uploadFileUser(file, signedRequest, url){
        const xhr = new XMLHttpRequest();
        let that = this;
        xhr.open('PUT', signedRequest);
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4){
                if(xhr.status === 200){
                    that.setState({ profilePic: url });
                    //document.getElementById('preview').src = url;
                    //document.getElementById('avatar-url').value = url;
                }
                else{
                    alert('Could not upload file.');
                }
            }
        };
        xhr.send(file);
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
    handleInputChangeCode(event) {
        this.setState({ inputValueCode: event.target.value });
    }
    handleButtonClick(event) {
        var that = this;
        event.preventDefault();
        auth.createUserWithEmailAndPassword(that.state.inputValueEmail, that.state.inputValuePwd).then(function () {
            console.log("user registered with email: " + that.state.inputValueEmail);
            const userName = that.state.inputValueName;
            const userPhone = "1" + that.state.inputValuePhone;
            const userEmail = that.state.inputValueEmail;
            const uid = auth.currentUser.uid;
            const managedTeams = [];
            const notManagedTeams = [];
            API.newUser(userName,userPhone,userEmail,uid, managedTeams, notManagedTeams).then(console.log("sent to database"));
            that.setState({ inputValueName: "",inputValuePhone: "",inputValueEmail: "", inputValuePwd: "" });

        }).catch(function (error) {

            if (error) {
                console.log("something went wrong");
                console.log(error)
            }

        });

    }
    handleButtonClickLogin(event) {
        const that = this;
        event.preventDefault();

        auth.signInWithEmailAndPassword(that.state.inputValueEmail, that.state.inputValuePwd).then(function () {

            that.setState({inputValueEmail: "", inputValuePwd: "" });

        }).catch(function (error) {

            if (error) {
                console.log("something went wrong");
                console.log(error)
            }

        });

    }
    handleCreateTeam(event) {

        event.preventDefault();
        const team = this.state.inputValueTeam;


        API.newTeam(this.state.currentUid, team,this. state.userInfo._id).then(this.getTeams);
        this.setState({ inputValueTeam: "" });


    }
    handleJoinTeam(event) {

        event.preventDefault();
        const code = this.state.inputValueCode;


        API.joinTeam(this.state.currentUid, code, this.state.userInfo).then(this.getTeams);
        this.setState({ inputValueCode: "" });


    }
    logout(event) {
        var that = this;
        event.preventDefault();
        auth.signOut()
            .then(() => {
                that.setState({
                    loginForm: "Register",
                    inputValueName: "",
                    inputValueEmail: "",
                    inputValuePwd: "",
                    inputValueTeam: "",
                    inputValueCode: "",
                    currentUid:"",
                    managedTeams:[],
                    notManagedTeams: [],
                    count: 0,
                    user: null // <-- add this line
                });
            });

    }

    getTeams() {
        API.getUserInfo(this.state.currentUid).then((res) => {
            console.log(res.data);
            this.setState({ managedTeams: res.data[0].managedTeams, notManagedTeams: res.data[0].notManagedTeams });
        });
    }

    renderTeams() {

        return this.state.managedTeams.map((team,i) => (
            <ManagedTeam
                team={team.name}
                _id={team._id}
                key={i}
                getTeams={this.getTeams}
                uid={this.state.currentUid}
            />
        ));



    }

    renderNotManagedTeams() {

        return this.state.notManagedTeams.map((team,i) => (
            <NotManagedTeam
                team={team.name}
                _id={team._id}
                key={i}
                getTeams={this.getTeams}
                uid={this.state.currentUid}
            />
        ));



    }
    changeForm(event) {

        event.preventDefault();
        if(this.state.loginForm === "Register"){
            this.setState({ loginForm: "Login" });
        }else{
            this.setState({ loginForm: "Register" });
        }


    }
    render() {
        return (

            <div className="container-fluid">
                {this.state.user ?

                    <div className='wrapper'>
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
                                <ul className="nav navbar-nav navbar-right">
                                    <li>
                                        <a onClick={this.logout} style={{cursor: "pointer"}}>Logout</a>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                        <div className="row">
                            <div className="col-xs-12 col-md-12">
                                <div className="panel panel-default">
                                    <div className="panel-heading">
                                        My Teams
                                    </div>
                                    <div>
                                        {this.renderTeams()}
                                    </div>
                                    <div>
                                        {this.renderNotManagedTeams()}
                                    </div>
                                </div>
                            </div>
                            <div className="col-xs-12 col-md-12">
                                <div className="panel panel-default">
                                    <div className="panel-heading">
                                        Create a Team
                                    </div>
                                    <div className="panel-body">
                                        <form>

                                            <div className="col-sm-10">
                                                <input onChange={this.handleInputChangeTeam} value={this.state.inputValueTeam}
                                                       className="form-control" id="name" placeholder="Enter new team's name"/>
                                            </div>
                                        </form>
                                        <div className="form-group">
                                            <div className="col-sm-10" style={{marginTop: "10px"}}>
                                                <button className="btn btn-primary" onClick={this.handleCreateTeam}>Submit
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xs-12 col-md-12">
                                <div className="panel panel-default">
                                    <div className="panel-heading">
                                        Join a Team
                                    </div>
                                    <div className="panel-body">
                                        <form>

                                            <div className="col-sm-10">
                                                <input onChange={this.handleInputChangeCode} value={this.state.inputValueCode}
                                                       className="form-control" id="code" placeholder="Enter a team's code"/>
                                            </div>
                                        </form>
                                        <div className="form-group">
                                            <div className=" col-sm-10" style={{marginTop: "10px"}}>
                                                <button className="btn btn-primary" onClick={this.handleJoinTeam}>Submit
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div style={{marginTop: "100px"}}>
                        <RegisterForm
                            handleInputChangeName = {this.handleInputChangeName}
                            inputValueName = {this.state.inputValueName}
                            handleInputChangePhone = {this.handleInputChangePhone}
                            inputValuePhone = {this.state.inputValuePhone}
                            handleInputChangeImage = {this.handleInputChangeImage}
                            inputValueImage = {this.state.inputValueImage}
                            handleInputChangeEmail = {this.handleInputChangeEmail}
                            inputValueEmail = {this.state.inputValueEmail}
                            handleInputChangePwd = {this.handleInputChangePwd}
                            inputValuePwd = {this.state.inputValuePwd}
                            handleButtonClick = {this.handleButtonClick}
                            handleButtonClickLogin = {this.handleButtonClickLogin}
                            changeForm = {this.changeForm}
                            loginForm = {this.state.loginForm}
                            profilePic = {this.state.profilePic}
                        />
                    </div>
                }

            </div>
        );
    }
}

export default Login;
