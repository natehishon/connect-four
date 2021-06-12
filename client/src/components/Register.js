import React, {Fragment, useState} from "react";
import { Link, Redirect } from "react-router-dom";

const Register = ({setAuth}) => {

    const [inputs, setInputs] = useState({
        email: "",
        password: "",
        name: ""
    })

    const {email, password, name} = inputs;

    const onChange = (e) => {
        setInputs({...inputs, [e.target.name]: e.target.value})
    }

    const onSubmitForm = async (e) => {
        e.preventDefault()

        try {

            const body = {email, password, name};

            const response = await fetch("/auth/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            })

            const parseRes = await response.json();
            localStorage.setItem("token", parseRes.jwtToken)
            setAuth(true)
            console.log(parseRes);

        } catch (err) {
            console.log(err)
        }
    }

    return (
        <Fragment>
            <h1>Register</h1>
            <form onSubmit={onSubmitForm}>
                <input
                    type="email"
                    name="email"
                    placeholder="email"
                    value={email}
                    onChange={e => onChange(e)}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="password"
                    value={password}
                    onChange={e => onChange(e)}
                />
                <input
                    type="text"
                    name="name"
                    placeholder="name"
                    value={name}
                    onChange={e => onChange(e)}
                />
                <button>Submit</button>
            </form>
            <Link to="/login">login</Link>
        </Fragment>
    );
}

export default Register;