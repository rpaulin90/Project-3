/**
 * Created by rpaulin on 8/3/17.
 */
import React, { Component } from "react";
import firebase, { auth } from '../firebase.js';
import API from "../utils/API";
import { Link } from "react-router";
import BigCalendar from 'react-big-calendar';
import moment from 'moment';

import ModalCalendar from "./common/ModalCalendar";

BigCalendar.momentLocalizer(moment);

let allViews = Object.keys(BigCalendar.views).map(k => BigCalendar.views[k]);


class Calendar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            games:[{}],
            isOpen: false,
            user: null, // <-- add this line
            inputValueEvent: "",
            inputValueTextarea: "",
            teamId: "",
            currentUid: "",
            newEvent: {},
            manager: false,
            teamInfo: {}

        };


        this.toggleModal = this.toggleModal.bind(this);
        this.onlyToggle = this.onlyToggle.bind(this);
        this.handleInputChangeEvent = this.handleInputChangeEvent.bind(this);
        this.handleInputChangeTextarea = this.handleInputChangeTextarea.bind(this);
        this.handleCreateEvent = this.handleCreateEvent.bind(this);

    }

    componentDidMount() {

        console.dir(this.props);
        this.fireBaseListener = auth.onAuthStateChanged((user) => {
            if (user) {
                let that = this;
                const uid = auth.currentUser.uid;
                API.getCalendarInfo(uid, this.props.params.id).then((res) => {
                    console.log(res);
                    if(res.data[0][0].managedTeams.length === 0) {

                        let gamesArrayOnMount = [];

                        for(let x = 0; x < res.data[1][0].calendarGames.length; x++){

                            gamesArrayOnMount.push({
                                'title': res.data[1][0].calendarGames[x].title,
                                'allDay': false,
                                'start':new Date(res.data[1][0].calendarGames[x].start),
                                'end':new Date(res.data[1][0].calendarGames[x].end)
                            })

                        }

                        this.setState({
                            user,
                            currentUid: auth.currentUser.uid,
                            teamId: this.props.params.id,
                            manager: false,
                            games: gamesArrayOnMount, //need to put res.data...with games from database
                            teamInfo: res.data[1][0]
                        });

                    }else{

                        for(var x = 0; x < res.data[0][0].managedTeams.length; x++){
                            if(res.data[0][0].managedTeams[x]._id === this.props.params.id){

                                let gamesArrayOnMount = [];

                                for(let x = 0; x < res.data[1][0].calendarGames.length; x++){

                                    gamesArrayOnMount.push({
                                        'title': res.data[1][0].calendarGames[x].title,
                                        'allDay': false,
                                        'start':new Date(res.data[1][0].calendarGames[x].start),
                                        'end':new Date(res.data[1][0].calendarGames[x].end)
                                    })

                                }

                                this.setState({
                                    user,
                                    currentUid: auth.currentUser.uid,
                                    teamId: this.props.params.id,
                                    manager: true,
                                    games: gamesArrayOnMount, //need to put res.data...with games from database
                                    teamInfo: res.data[1][0]
                                });
                                return

                            }else{
                                let gamesArrayOnMount = [];

                                for(let x = 0; x < res.data[1][0].calendarGames.length; x++){

                                    gamesArrayOnMount.push({
                                        'title': res.data[1][0].calendarGames[x].title,
                                        'allDay': false,
                                        'start':new Date(res.data[1][0].calendarGames[x].start),
                                        'end':new Date(res.data[1][0].calendarGames[x].end)
                                    })

                                }

                                this.setState({
                                    user,
                                    currentUid: auth.currentUser.uid,
                                    teamId: this.props.params.id,
                                    manager: false,
                                    games: gamesArrayOnMount, //need to put res.data...with games from database
                                    teamInfo: res.data[1][0]
                                });
                            }
                        }

                    }


                });

            }
        });
    }
    componentWillUnmount() {
        this.fireBaseListener && this.fireBaseListener();
    }


    toggleModal(slotInfo) {
        console.log("slotInfo: " + slotInfo.start);
        this.setState({
            isOpen: !this.state.isOpen,
            newEvent: {start: slotInfo.start, end: slotInfo.end}
        });
    }

    onlyToggle() {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }


    handleInputChangeEvent(event) {
        this.setState({ inputValueEvent: event.target.value });
    }

    handleInputChangeTextarea(event) {
        this.setState({ inputValueTextarea: event.target.value });
    }

    handleCreateEvent(event){

        event.preventDefault();

        let that = this;

        let savedLineup;
        let lineupNames = [];

        if(this.state.teamInfo.nextEvent[0].lineup){
            savedLineup = this.state.teamInfo.nextEvent[0].lineup;
            lineupNames = this.state.teamInfo.nextEvent[0].lineupNames;
        }else{

            savedLineup = [{
                x: 0, y: 0
            },{
                x: 0, y: 0
            },{
                x: 0, y: 0
            },{
                x: 0, y: 0
            },{
                x: 0, y: 0
            },{
                x: 0, y: 0
            },{
                x: 0, y: 0
            },{
                x: 0, y: 0
            },{
                x: 0, y: 0
            },{
                x: 0, y: 0
            },{
                x: 0, y: 0
            }];

            for(let y = 0; y < 11; y++){
                lineupNames.push("click to edit")
            }

        }


        let newEvent = {
            'id': parseInt(new Date().valueOf()),
            'title': this.state.inputValueEvent,
            'allDay': false,
            'start':that.state.newEvent.start,
            'end':that.state.newEvent.end,
            'notes': this.state.inputValueTextarea,
            'participants': [],
            'lineup': savedLineup,
            'lineupNames': lineupNames
        };
        API.addEvent(this.state.teamId, newEvent).then((res) => {

            let gamesArray = [];

            for(let x = 0; x < res.data.calendarGames.length; x++){

                gamesArray.push({
                    'title': res.data.calendarGames[x].title,
                    'allDay': false,
                    'start':new Date(res.data.calendarGames[x].start),
                    'end':new Date(res.data.calendarGames[x].end)
                })

            }


            console.log(res);

            this.setState({games: gamesArray, inputValueEvent: "",inputValueTextarea: "", isOpen: !this.state.isOpen, newEvent:{}});
            //this.onlyToggle();

        });

        //console.log("start: " + slotInfo.start + ", end: " + slotInfo.end);

    }

    render() {

        return (
            <div>
                <div>
                    <ModalCalendar show={this.state.isOpen}
                                   onClose={this.toggleModal}>
                        <form className="form-horizontal">
                            <fieldset>
                                <legend>Make an event</legend>
                                <div className="form-group">
                                    <label className="col-lg-2 control-label">Event Title</label>
                                    <div className="col-lg-10">
                                        <input onChange={this.handleInputChangeEvent} value={this.state.inputValueEvent} type="text" className="form-control" id="inputEvent" placeholder="Enter event title"/>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-lg-2 control-label">Additional notes</label>
                                    <div className="col-lg-10">
                                        <textarea onChange={this.handleInputChangeTextarea} value={this.state.inputValueTextarea} className="form-control" rows="3" id="textArea">

                                        </textarea>
                                        <span className="help-block">Enter any additional notes or comments you want your team to see.</span>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-lg-10 col-lg-offset-2">
                                        <button type="submit" className="btn btn-primary" onClick={this.handleCreateEvent}>Submit</button>
                                        <button type="cancel" className="btn btn-default" onClick={this.toggleModal}>Cancel</button>
                                    </div>
                                </div>
                            </fieldset>
                        </form>
                    </ModalCalendar>
                </div>
                <div style={{height: "1000px"}}>
                    {this.state.manager ?
                        <BigCalendar
                            {...this.props}
                            events={this.state.games}
                            views={allViews}
                            //view="month"
                            defaultView='month'
                            onView={function () {
                                console.log("is this fine?")
                            }}
                            //defaultDate={new Date()}
                            toolbar={true}
                            selectable={true}
                            onSelectSlot={this.toggleModal}
                        />
                        :
                        <BigCalendar
                            {...this.props}
                            events={this.state.games}
                            views={allViews}
                            //view="month"
                            defaultView='month'
                            onView={function () {
                                console.log("is this fine?")
                            }}
                            //defaultDate={new Date()}
                            toolbar={true}
                        />
                    }

                </div>
            </div>

        )


    }
}



export default Calendar;