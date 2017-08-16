/**
 * Created by rpaulin on 8/2/17.
 */
import React, { Component } from "react";
var FileInput = require('react-file-input');

class RegisterForm extends Component {

    render() {
        return (

            <div className="panel panel-default" style={{backgroundColor: "transparent"}}>
                {this.props.loginForm === "Register" ?
                    <div>
                        <div className="panel-body" style={{margin: "auto"}}>
                            {/*<h2>Register</h2>*/}
                            <form className="form-horizontal">
                                <div className="form-group">
                                    <label className="control-label col-sm-2">Name:</label>
                                    <div className="col-sm-10">
                                        <input style={{width: "80%"}} onChange={this.props.handleInputChangeName} value={this.props.inputValueName}
                                               className="form-control" id="name" placeholder="Enter your name"/>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="control-label col-sm-2">Phone:</label>
                                    <div className="col-sm-10">
                                        <input style={{width: "80%"}} onChange={this.props.handleInputChangePhone} value={this.props.inputValuePhone}
                                               className="form-control" id="phone" placeholder="Enter your cell phone number"/>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="control-label col-sm-2">Image:</label>
                                    <div className="col-sm-10">
                                        <img id="preview" src={this.props.profilePic} />
                                        <FileInput type="file" className="form-control inputClass" id="file-input" onChange={this.props.handleInputChangeImage} value={this.props.inputValueImage} placeholder="My Image"/>
                                </div>
                                </div>
                                <div className="form-group">
                                    <label className="control-label col-sm-2">Email:</label>
                                    <div className="col-sm-10">
                                        <input style={{width: "80%"}} onChange={this.props.handleInputChangeEmail}
                                               value={this.props.inputValueEmail} type="email" className="form-control"
                                               id="email" placeholder="Enter email" name="email"/>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="control-label col-sm-2">Password:</label>
                                    <div className="col-sm-10">
                                        <input style={{width: "80%"}} onChange={this.props.handleInputChangePwd} value={this.props.inputValuePwd}
                                               type="password" className="form-control" id="pwd"
                                               placeholder="Enter password" name="pwd"/>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-sm-offset-2 col-sm-10" style={{marginBottom: "20px"}}>
                                        <button className="btn btn-default" onClick={this.props.handleButtonClick}>Register
                                        </button>
                                    </div>
                                    <div className="col-sm-offset-2 col-sm-10">
                                        <a href="" onClick={this.props.changeForm}>Log In</a>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    :

                    <div>

                        <div>
                            <div className="panel-body" style={{margin: "auto"}}>
                                <form className="form-horizontal">
                                    <div className="form-group">
                                        <label className="control-label col-sm-2">Email:</label>
                                        <div className="col-sm-10">
                                            <input style={{width: "80%"}} onChange={this.props.handleInputChangeEmail}
                                                   value={this.props.inputValueEmail} type="email" className="form-control"
                                                   id="email" placeholder="Enter email" name="email"/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label col-sm-2">Password:</label>
                                        <div className="col-sm-10">
                                            <input style={{width: "80%"}} onChange={this.props.handleInputChangePwd} value={this.props.inputValuePwd}
                                                   type="password" className="form-control" id="pwd"
                                                   placeholder="Enter password" name="pwd"/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="col-sm-offset-2 col-sm-10" style={{marginBottom: "20px"}}>
                                            <button className="btn btn-default" onClick={this.props.handleButtonClickLogin}>Log In
                                            </button>
                                        </div>
                                        <div className="col-sm-offset-2 col-sm-10">
                                            <a href="" onClick={this.props.changeForm}>Register</a>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                    </div>


                }
            </div>
        );
    }
}


export default RegisterForm;


