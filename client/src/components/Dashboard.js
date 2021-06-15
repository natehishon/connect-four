// import React, {Fragment, useState, useEffect} from "react";
// import Game from "./Game";
//
// const Dashboard = ({setAuth}) => {
//
//     const [name, setName] = useState("")
//
//     const getProfile = async () => {
//         try {
//             const res = await fetch("/dashboard/", {
//                 method: "POST",
//                 headers: { jwt_token: localStorage.token }
//             });
//
//             const parseData = await res.json();
//             setName(parseData.user_name);
//         } catch (err) {
//             console.error(err.message);
//         }
//     };
//
//     const logout = async e => {
//         e.preventDefault();
//         try {
//             localStorage.removeItem("token");
//             setAuth(false);
//         } catch (err) {
//             console.error(err.message);
//         }
//     };
//
//     useEffect(() => {
//         getProfile();
//     }, []);
//
//     return (
//         <Fragment>
//             <h1>Dashboard</h1>
//             <h2>Welcome {name}</h2>
//
//             <Game />
//
//             <button onClick={e => logout(e)} className="">
//                 Logout
//             </button>
//         </Fragment>
//     );
// }
//
// export default Dashboard;

import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Navbar from "./Navbar";
import NewGameModal from "./NewGameModal";
import JoinGameModal from "./JoinGameModal";
import ResumeGameModal from "./ResumeGameModal";


const useStyles = makeStyles((theme) => ({
    '@global': {
        ul: {
            margin: 0,
            padding: 0,
            listStyle: 'none',
        },
    },
    appBar: {
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    toolbar: {
        flexWrap: 'wrap',
    },
    toolbarTitle: {
        flexGrow: 1,
    },
    link: {
        margin: theme.spacing(1, 1.5),
    },
    heroContent: {
        padding: theme.spacing(8, 0, 6),
    },
    cardHeader: {
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
    },
    cardPricing: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'baseline',
        marginBottom: theme.spacing(2),
    },
    footer: {
        borderTop: `1px solid ${theme.palette.divider}`,
        marginTop: theme.spacing(8),
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
        [theme.breakpoints.up('sm')]: {
            paddingTop: theme.spacing(6),
            paddingBottom: theme.spacing(6),
        },
    },
}));


export default function Dashboard({setAuth, user}) {

    const [openNew, setOpenNew] = useState(false);
    const [openJoin, setOpenJoin] = useState(false);
    const [openProg, setOpenProg] = useState(false);


    const handleNewOpen = () => {
        setOpenNew(true);
    };

    const handleNewClose = () => {
        setOpenNew(false);
    };

    const handleJoinOpen = () => {
        setOpenJoin(true);
    };

    const handleJoinClose = () => {
        setOpenJoin(false);
    };

    const handleProOpen = () => {
        setOpenProg(true);
    };

    const handleProClose = () => {
        setOpenProg(false);
    };

    const classes = useStyles();

    useEffect(() => {
        // getProfile();
    }, []);

    return (
        <React.Fragment>
            <CssBaseline/>

            <Navbar setAuth={setAuth}/>

            {/* Hero unit */}
            <Container maxWidth="sm" component="main" className={classes.heroContent}>
                <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                    Connect Four!
                </Typography>
                <Typography variant="h5" align="center" color="textSecondary" component="p">
                    Welcome {user.user_name} choose your game options:
                </Typography>
            </Container>
            {/* End hero unit */}
            <Container maxWidth="md" component="main">
                <Grid container spacing={5} alignItems="flex-end">
                    <Grid item xs={12} sm={6} md={4}>


                        <Card>
                            <CardHeader
                                title="New Game"
                                titleTypographyProps={{align: 'center'}}
                                subheaderTypographyProps={{align: 'center'}}
                                className={classes.cardHeader}
                            />
                            <NewGameModal open={openNew} handleClose={handleNewClose} propUser={user}/>
                            <CardContent>
                                <ul>
                                    <Typography component="li" variant="subtitle1" align="center">
                                        Create a new game
                                    </Typography>
                                </ul>
                            </CardContent>
                            <CardActions>
                                <Button fullWidth variant="outlined" color="primary"
                                        onClick={handleNewOpen}>
                                    Create
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Card>
                            <CardHeader
                                title="Join Game"
                                titleTypographyProps={{align: 'center'}}
                                subheaderTypographyProps={{align: 'center'}}
                                className={classes.cardHeader}
                            />
                            <JoinGameModal open={openJoin} handleClose={handleJoinClose} propUser={user}/>
                            <CardContent>
                                <ul>
                                    <Typography component="li" variant="subtitle1" align="center">
                                        Join a game
                                    </Typography>
                                </ul>
                            </CardContent>
                            <CardActions>
                                <Button fullWidth variant="outlined" color="primary"
                                        onClick={handleJoinOpen}>
                                    Join
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>

                        <Card>
                            <CardHeader
                                title="Resume Game"
                                titleTypographyProps={{align: 'center'}}
                                subheaderTypographyProps={{align: 'center'}}
                                className={classes.cardHeader}
                            />
                            <ResumeGameModal open={openProg} handleClose={handleProClose} propUser={user}/>
                            <CardContent>
                                <ul>
                                    <Typography component="li" variant="subtitle1" align="center">
                                        Resume a game
                                    </Typography>
                                </ul>
                            </CardContent>
                            <CardActions>
                                <Button fullWidth variant="outlined" color="primary"
                                        onClick={handleProOpen}>
                                    Resume
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                </Grid>
            </Container>

        </React.Fragment>
    );
}