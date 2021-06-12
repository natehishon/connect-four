import React, {Fragment, useState, useEffect} from "react";
import './App.css';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom"

import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {

    const checkAuthenticated = async () => {
        try {
            console.log("1")
            const res = await fetch("/auth/verify", {
                method: "POST",
                headers: {jwt_token: localStorage.token}
            });

            console.log("2")
            const parseRes = await res.json();

            console.log("parse")
            console.log(parseRes)

            parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
        } catch (err) {
            console.error(err.message);
        }
    };

    useEffect(() => {
        console.log("running")
        checkAuthenticated();
    }, []);

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const setAuth = (boolean) => {
        setIsAuthenticated(boolean);
    }


    return (
        <Fragment>
            <Router>
                <div className="container">
                    <Switch>
                        <Route exact
                               path="/login"
                               render={props =>
                                   !isAuthenticated ? (
                                       <Login {...props} setAuth={setAuth}/>
                                   ) : (
                                       <Redirect to="/dashboard"/>
                                   )
                               }
                        />

                        <Route
                            exact
                            path="/register"
                            render={props =>
                                !isAuthenticated ? (
                                    <Register {...props} setAuth={setAuth}/>
                                ) : (
                                    <Redirect to="/login"/>
                                )
                            }
                        />
                        <Route
                            exact
                            path="/dashboard"
                            render={props =>
                                isAuthenticated ? (
                                    <Dashboard {...props} setAuth={setAuth}/>
                                ) : (
                                    <Redirect to="/login"/>
                                )
                            }
                        />
                    </Switch>
                </div>
            </Router>
        </Fragment>
    );
}

export default App;
