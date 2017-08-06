/**
 * Created by rpaulin on 8/5/17.
 */
import React, { Component } from "react";
var Draggable = require("react-draggable");
import API from "../../utils/API";
import { Link } from "react-router";

class Field extends Component {

    render() {
        const that = this;
        const dragHandlers = {onStart: this.props.onStart, onStop: this.props.onStop};
        return (

        <div style={{border: "1px solid black", height: "750px",width: "600px",backgroundColor:"green"}}>
            <Draggable bounds={{top: 0, left: 0, right: 420, bottom: 570}} {...dragHandlers}>
                <div style={styles.box}>
                    I can only be moved within my offsetParent.<br /><br />
                    Both parent padding and child margin work properly.
                </div>
            </Draggable>
        </div>

        );
    }
}

const styles = {
    box: {
    background: "#fff",
    border: "1px solid #999",
    borderRadius: "3px",
    width: "180px",
    height: "180px",
    //margin: "10px",
    padding: "10px",
    float: "left"
    },
    deleteStyle: {
        cursor: "pointer",
        marginLeft: 5,
        color: "red",
        float: "right"
    }
};

export default Field;
