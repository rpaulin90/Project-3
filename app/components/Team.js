/**
 * Created by rpaulin on 8/2/17.
 */
import React, { Component } from "react";
import firebase, { auth } from '../firebase.js';
import API from "../utils/API";


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

    }

    componentDidMount() {

        console.dir(this.props);
        this.fireBaseListener = auth.onAuthStateChanged((user) => {
            if (user) {
                let that = this;
                const uid = auth.currentUser.uid;
                API.getUserInfo(uid).then((res) => {
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

                });

            }
        });
    }
    componentWillUnmount() {
        this.fireBaseListener && this.fireBaseListener();
    }

    render() {
        return (
            <div>
                {this.state.manager ?
                    <div>
                        I'm a manager!
                    </div>
                    :
                    <div>
                        I'm not a manager :(
                    </div>
                }
            </div>

        )


    }
}



export default Team;