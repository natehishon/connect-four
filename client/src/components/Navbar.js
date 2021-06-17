import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";

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
}));


export default function Navbar( {setAuth: setAuth} ) {

    const classes = useStyles();

        const logout = async e => {
        e.preventDefault();
        try {
            localStorage.removeItem("token");
            setAuth(false);

        } catch (err) {
            console.error(err.message);
        }
    };

    return(

    <AppBar position="static" color="default" elevation={0} className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
            <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
                Connect Four
            </Typography>
            <nav>
                <Link variant="button" color="textPrimary" href="/dashboard" className={classes.link}>
                    Dashboard
                </Link>
            </nav>
            <Button onClick={e => logout(e)} color="primary" variant="outlined" className={classes.link}>
                Logout
            </Button>
        </Toolbar>
    </AppBar>

    )

}

