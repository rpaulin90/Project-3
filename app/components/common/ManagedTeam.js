/**
 * Created by rpaulin on 8/1/17.
 */
import React, { Component } from "react";
import API from "../../utils/API";
import { Link } from "react-router";

class ManagedTeam extends Component {

    deleteTeam(id) {
        API.deleteTeam(id).then(this.props.getTeams);
    }

    render() {
        return (

            <div className="container-fluid">
                <div className="panel panel-default" style={{backgroundColor: "transparent", border: "white dotted", margin: "10px"}}>
                    <div className="panel-body" style={{cursor: "pointer"}}>

                        <li style={{listStyle: "none"}} className={location.pathname === ("/team/"+this.props._id) && "active"}>
                            <Link to={"/team/"+this.props._id}><i
                                //onClick={() => this.favoriteQuote(this.props.quote)}
                                style={styles.favoriteStyle}
                                className="fa fa-trophy"
                                aria-hidden="true"
                            /> {this.props.team}</Link>
                            <i
                                onClick={() => this.deleteTeam(this.props._id)}
                                style={styles.deleteStyle}
                                className="fa fa-trash-o"
                                aria-hidden="true"
                            />
                        </li>
                    </div>
                </div>
            </div>
        );
    }
}

const styles = {
    favoriteStyle: {
        cursor: "pointer",
        marginRight: 5,
        color: "gold",
        float: "left"
    },
    deleteStyle: {
        cursor: "pointer",
        marginLeft: 5,
        color: "red",
        float: "right"
    }
};

export default ManagedTeam;
