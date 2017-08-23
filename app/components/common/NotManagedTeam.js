/**
 * Created by rpaulin on 8/2/17.
 */
import React, { Component } from "react";
import API from "../../utils/API";
import { Link } from "react-router";

class NotManagedTeam extends Component {

    render() {
        return (
            <div className="container-fluid">
                <div className="panel panel-default" style={{margin: "10px", border: "white dotted", backgroundColor: "transparent"}} >
                    <div className="panel-body" style={{cursor: "pointer"}}>
                        <i
                            //onClick={() => this.deleteQuote(this.props.quote._id)}
                            style={styles.deleteStyle}
                            className="fa fa-trash-o"
                            aria-hidden="true"
                        />
                        <li style={{listStyle: "none"}} className={location.pathname === ("/team/"+this.props._id) && "active"}>
                            <Link to={"/team/"+this.props._id}>{this.props.team}</Link>
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

export default NotManagedTeam;
