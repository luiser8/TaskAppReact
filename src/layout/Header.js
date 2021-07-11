import React, { useState, useEffect, Fragment, useContext } from 'react';
import { AppBar, makeStyles, IconButton, Toolbar, Typography, MenuItem, Menu } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
//import MenuIcon from '@material-ui/icons/Menu';
import { Context } from '../utils/Context';
import Routes from '../utils/Routes';
import '../utils/Config';
//import Logout from '../components/Logout';

const Header = ({ mode }) => {
    const { checkUser, logout } = useContext(Context);
    const [isDarkTheme, setIsDarkTheme] = useState(mode);
    var [current_path] = useState(window.location.pathname);
    var [path, setPath] = useState('');
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const classes = useStyles();
    //var { close } = Logout();
    
    useEffect(() => {
        setIsDarkTheme(true);
        switch(current_path){
            case '/':
                setPath('Tareas');
            break;
            case '/profile':
                setPath('Perfil');
            break;
            case '/signin':
                setPath('Registro');
            break;
            default :
                setPath('Nada')
        }
    }, []);

    return (
        <Fragment>
            <AppBar position="static">
                <Toolbar>
                    {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton> */}
                    <Typography variant="h6" className={classes.title}>
                        {(checkUser().IdUser) ? 
                            <>
                                <p>{path}</p>
                            </>
                            :
                            <>
                                <p>Por favor, iniciar sesión</p>
                            </>
                        }
                    </Typography>
                    {(checkUser().IdUser) ? 
                        <div>
                            <IconButton
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={(event) => setAnchorEl(event.currentTarget)}
                                color="inherit"
                            >
                                <Typography>{`${checkUser().FirstName} ${checkUser().LastName}`}</Typography><AccountCircle />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={open}
                                onClose={(event) => setAnchorEl(null)}
                            >
                                {/* <MenuItem onClick={async () => await close(current_path)}>Cerrar</MenuItem> */}
                                <MenuItem onClick={async () => logout(null)}>Cerrar</MenuItem>
                            </Menu>
                        </div>
                        :
                        <></>
                    }
                </Toolbar>
            </AppBar>
            <Routes />
        </Fragment>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }));

export default Header;