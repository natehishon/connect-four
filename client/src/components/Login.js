import React, {Fragment, useState} from "react";
import { Link } from "react-router-dom";

const Login = ({setAuth}) => {

    const [inputs, setInputs] = useState({
        email: "",
        password: ""
    })

    const {email, password} = inputs

    const onChange = (e) => {
        setInputs({...inputs, [e.target.name]: e.target.value})
    }

    const onSubmitForm = async e => {
        e.preventDefault();

        try {
            const body = { email, password };
            const response = await fetch(
                "http://localhost:5000/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify(body)
                }
            );

            const parseRes = await response.json();
            localStorage.setItem("token", parseRes.jwtToken)
            setAuth(true)

            // if (parseRes.jwtToken) {
            //     localStorage.setItem("token", parseRes.jwtToken);
            //     setAuth(true);
            // } else {
            //     setAuth(false);
            // }
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <Fragment>
            <h1>Login</h1>
            <form onSubmit={onSubmitForm}>
                <input type="email"
                       name="email"
                       placeholder="email"
                       value={email}
                       onChange={e => onChange(e)}
                />
                <input type="password"
                       name="password"
                       placeholder="password"
                       value={password}
                       onChange={e => onChange(e)}
                />
                <button>Submit</button>
            </form>
            <Link to="/register">register</Link>
        </Fragment>
    );
}

export default Login;