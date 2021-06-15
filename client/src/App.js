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
import Game from "./components/Game";

function App() {

    const [loading, setLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false);


    const getData = async () => {
        try {
            const res = await fetch("/auth/verify", {
                method: "POST",
                headers: {jwt_token: localStorage.token}
            });

            const parseRes = await res.json();

            parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);

            setLoading(false);

        } catch (err) {
            setLoading(false);
            console.error(err.message);
        }
    };



    useEffect(() => {
        getData();
    }, []);



    const setAuth = (boolean) => {
        setIsAuthenticated(boolean);
    }

    if(loading === true){
        return <div>loading</div>
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
                                    <Redirect to="/dashboard"/>
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
                        <Route
                            exact
                            path="/game/:id"
                            render={props =>
                                isAuthenticated ? (
                                    <Game {...props} setAuth={setAuth}/>
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
