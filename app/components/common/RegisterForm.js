/**
 * Created by rpaulin on 8/2/17.
 */
import React, { Component } from "react";

class RegisterForm extends Component {

    render() {
        return (

            <div className="panel panel-default">
                {this.props.loginForm === "Register" ?
                    <div>
                        <div className="panel-body">
                            <h2>Horizontal form</h2>
                            <form className="form-horizontal">
                                <div className="form-group">
                                    <label className="control-label col-sm-2">Name:</label>
                                    <div className="col-sm-10">
                                        <input onChange={this.props.handleInputChangeName} value={this.props.inputValueName}
                                               className="form-control" id="name" placeholder="Enter your name"/>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="control-label col-sm-2">Email:</label>
                                    <div className="col-sm-10">
                                        <input onChange={this.props.handleInputChangeEmail}
                                               value={this.props.inputValueEmail} type="email" className="form-control"
                                               id="email" placeholder="Enter email" name="email"/>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="control-label col-sm-2">Password:</label>
                                    <div className="col-sm-10">
                                        <input onChange={this.props.handleInputChangePwd} value={this.props.inputValuePwd}
                                               type="password" className="form-control" id="pwd"
                                               placeholder="Enter password" name="pwd"/>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-sm-offset-2 col-sm-10">
                                        <button className="btn btn-default" onClick={this.props.handleButtonClick}>Submit
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        < div className = "panel-footer" >
                            < span id="go_to_login"><a href="" onClick={this.props.changeForm}>Log In</a></span>
                        </div>
                    </div>
                    :

                    <div>

                        <div>
                            <div className="panel-body">
                                <h2>Horizontal form</h2>
                                <form className="form-horizontal">
                                    <div className="form-group">
                                        <label className="control-label col-sm-2">Email:</label>
                                        <div className="col-sm-10">
                                            <input onChange={this.props.handleInputChangeEmail}
                                                   value={this.props.inputValueEmail} type="email" className="form-control"
                                                   id="email" placeholder="Enter email" name="email"/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label col-sm-2">Password:</label>
                                        <div className="col-sm-10">
                                            <input onChange={this.props.handleInputChangePwd} value={this.props.inputValuePwd}
                                                   type="password" className="form-control" id="pwd"
                                                   placeholder="Enter password" name="pwd"/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="col-sm-offset-2 col-sm-10">
                                            <button className="btn btn-default" onClick={this.props.handleButtonClickLogin}>Submit
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            < div className = "panel-footer" >
                                < span id="go_to_login"><a href="" onClick={this.props.changeForm}>Register</a></span>
                            </div>
                        </div>

                    </div>


                }
            </div>
        );
    }
}


export default RegisterForm;


