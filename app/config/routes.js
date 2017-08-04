import React from "react";
import { Route, IndexRoute, Router, browserHistory } from "react-router";

import Main from "../components/Main";
import Login from "../components/Login";
import Team from "../components/Team";
import Calendar from "../components/Calendar";

const routes = (
    <Router history={browserHistory}>
        <Route path="/" component={Main}>
            <Route path="team/:id" component={Team} />
            <Route path="calendar/:id" component={Calendar} />
            <IndexRoute component={Login} />
        </Route>
    </Router>
);

export default routes;
