// import React, {Fragment, useState} from "react";
// import { Link } from "react-router-dom";
//
// const Login = ({setAuth}) => {
//
//     const [inputs, setInputs] = useState({
//         email: "",
//         password: ""
//     })
//
//     const {email, password} = inputs
//
//     const onChange = (e) => {
//         setInputs({...inputs, [e.target.name]: e.target.value})
//     }
//
//     const onSubmitForm = async e => {
//         e.preventDefault();
//
//         try {
//             const body = { email, password };
//             const response = await fetch(
//                 "/auth/login",
//                 {
//                     method: "POST",
//                     headers: {
//                         "Content-type": "application/json"
//                     },
//                     body: JSON.stringify(body)
//                 }
//             );
//
//             const parseRes = await response.json();
//             localStorage.setItem("token", parseRes.jwtToken)
//             setAuth(true)
//
//             // if (parseRes.jwtToken) {
//             //     localStorage.setItem("token", parseRes.jwtToken);
//             //     setAuth(true);
//             // } else {
//             //     setAuth(false);
//             // }
//         } catch (err) {
//             console.error(err.message);
//         }
//     };
//
//     return (
//         <Fragment>
//             <h1>Login</h1>
//             <form onSubmit={onSubmitForm}>
//                 <input type="email"
//                        name="email"
//                        placeholder="email"
//                        value={email}
//                        onChange={e => onChange(e)}
//                 />
//                 <input type="password"
//                        name="password"
//                        placeholder="password"
//                        value={password}
//                        onChange={e => onChange(e)}
//                 />
//                 <button>Submit</button>
//             </form>
//             <Link to="/register">register</Link>
//         </Fragment>
//     );
// }
//
// export default Login;


import React, {Fragment, useState} from "react";
// import { Link } from "react-router-dom";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

// function Copyright() {
//     return (
//         <Typography variant="body2" color="textSecondary" align="center">
//             {'Copyright © '}
//             <Link color="inherit" href="https://material-ui.com/">
//                 Nate Hishon
//             </Link>{' '}
//             {new Date().getFullYear()}
//             {'.'}
//         </Typography>
//     );
// }

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function Login({setAuth}) {
    const classes = useStyles();

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
            const body = {email, password};
            const response = await fetch(
                "/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify(body)
                }
            );

            const parseRes = await response.json();

            console.log("parseRes")
            console.log(parseRes)

            localStorage.setItem("token", parseRes.jwtToken)
            setAuth(true)

        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Connect Four Sign In
                </Typography>
                <form className={classes.form} noValidate onSubmit={onSubmitForm}>
                    <TextField
                        value={email}
                        onChange={e => onChange(e)}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        value={password}
                        onChange={e => onChange(e)}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="/register" variant="body2">Register</Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            {/*<Box mt={8}>*/}
            {/*    <Copyright/>*/}
            {/*</Box>*/}
        </Container>
    );
}