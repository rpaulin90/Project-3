/**
 * Created by rpaulin on 8/2/17.
 */
import React, { Component } from "react";
import API from "../../utils/API";

class NotManagedTeam extends Component {

    render() {
        return (
            <div className="container-fluid">
                <div className="panel panel-default" style={{margin: "10px"}}>
                    <div className="panel-body" style={{cursor: "pointer"}}>
                        <i
                            //onClick={() => this.deleteQuote(this.props.quote._id)}
                            style={styles.deleteStyle}
                            className="fa fa-trash-o"
                            aria-hidden="true"
                        />
                        {this.props.team}
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
