import React, {Fragment, useState, useEffect} from "react";
import Game from "./Game";

const Dashboard = ({setAuth}) => {

    const [name, setName] = useState("")

    const getProfile = async () => {
        try {
            const res = await fetch("/dashboard/", {
                method: "POST",
                headers: { jwt_token: localStorage.token }
            });

            const parseData = await res.json();
            setName(parseData.user_name);
        } catch (err) {
            console.error(err.message);
        }
    };

    const logout = async e => {
        e.preventDefault();
        try {
            localStorage.removeItem("token");
            setAuth(false);
        } catch (err) {
            console.error(err.message);
        }
    };

    useEffect(() => {
        getProfile();
    }, []);

    return (
        <Fragment>
            <h1>Dashboard</h1>
            <h2>Welcome {name}</h2>

            <Game />

            <button onClick={e => logout(e)} className="">
                Logout
            </button>
        </Fragment>
    );
}

export default Dashboard;