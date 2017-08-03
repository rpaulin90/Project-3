/**
 * Created by rpaulin on 8/1/17.
 */
import React, { Component } from "react";
import API from "../../utils/API";

class ManagedTeam extends Component {

    render() {
        return (
            <div className="container-fluid">
                <div className="panel panel-default" style={{margin: "10px"}}>
                    <div className="panel-body" style={{cursor: "pointer"}}>
                        <i
                            //onClick={() => this.favoriteQuote(this.props.quote)}
                            style={styles.favoriteStyle}
                            className="fa fa-trophy"
                            aria-hidden="true"
                        />
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

export default ManagedTeam;
