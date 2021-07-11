import React, { useContext, useState } from 'react';
import {
    Button,
    FormControl,
    Typography,
    TextField,
    Backdrop,
    CircularProgress,
    Snackbar,
    Checkbox,
    Box,
    Grid,
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { useForm } from 'react-hook-form';
import { Link } from '@reach/router';
import { Context } from '../utils/Context';
import '../utils/Config';

const Login = () => {
    const { login } = useContext(Context);
    const { register, formState, handleSubmit, errors } = useForm({ mode: "onChange" });
    //const [current_path] = useState(window.location.pathname);
    //const [before_path] = useState(document.referrer.split(current_path)[0]);
    const [messages, setMessages] = useState('');
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [alerts, setAlerts] = useState(false);
    const [severity, setSeverity] = useState('');
    const [remember, setRemember] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (data) => {
        setOpenBackdrop(true);
        await fetch(`${global.config.url.dev}Users/login`, {
            method: 'POST',
            headers: global.config.headers.dev,
            body: JSON.stringify({ 'Email': data.email, 'Password': data.password }),
            json: true
        }).then(response => {
            if (response.status >= 200 && response.status <= 299) {
                return setLogin(response.json())
            }else{
                response.json().then((json) => {
                    const { Message } = json;
                    console.log(Message); setAlerts(true); setSeverity('error'); setMessages(Message);
                });
                return null
            }
        }).catch((e) => {
            console.log(e); setAlerts(true); setSeverity('error'); setMessages('Algo pasó');
        })
        setTimeout(() => {
            setOpenBackdrop(false);
        }, 1000); 
    }

    const setLogin = async (req) => {
        if (req) {
            (await Promise.all([req])).map((items) => {
                if (items.Status === 1) {
                    login({
                        'IdUser' : items.IdUser,
                        'FirstName' : items.FirstName,
                        'LastName' : items.LastName
                    });
                    //window.location.assign(before_path);
                } else {
                    setAlerts(true); setSeverity('error'); setMessages('Usuario bloqueado');
                }
            })
        }
    }

    return (
        <main style={{ width: '40%', margin: '0 auto', marginTop: '80px'}}>
            {/* {(messages === '') ?
                <></>
                :
                <>
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                            <strong>{messages}</strong>
                    </Alert>
                </>
            } */}
            <div style={{background:'transparent'}}>

                <Typography component="h1" variant="h5">
                    Iniciar sesión
                </Typography>
                <form onSubmit={handleSubmit(handleLogin)}>
                    <FormControl margin="normal" fullWidth required>
                        <TextField
                            label="Correo de Usuario"
                            type="email"
                            name="email"
                            autoComplete="email"
                            margin="normal"
                            variant="standard"
                            error={!!errors.email}
                            defaultValue={email}
                            inputRef={register({
                                required: true,
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "El correo no cumple el patrón"
                                  }
                            })}
                        />
                        {(errors.email) ?
                            <Alert severity="error">
                                <AlertTitle>Error</AlertTitle>
                                <strong>{errors.email.message}</strong>
                            </Alert>
                            :
                            <></>
                        }
                    </FormControl>
                    <FormControl margin="normal" fullWidth required>
                        <TextField
                            label="Contraseña de Usuario"
                            type="password"
                            name="password"
                            autoComplete="password"
                            margin="normal"
                            variant="standard"
                            error={!!errors.password}
                            defaultValue={password}
                            inputRef={register({
                                required: true,
                                minLength: {
                                    value: 3,
                                    message: "min length is 5"
                                  }
                            })}
                        />
                        {(errors.password) ?
                            <Alert severity="error">
                                <AlertTitle>Error</AlertTitle>
                                <strong>{errors.password && 'Debes colocar la contraseña de usuario'}</strong>
                            </Alert>
                            :
                            <></>
                        }
                    </FormControl>
                    
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={styles.submit}
                        disabled={!formState.isValid}>
                        Entrar
                        </Button>
                    <Grid container direction="row" >
                        <Grid item alignContent="flex-start">
                            <Box paddingTop={2}>
                                <Typography>Recuérdame
                                <Checkbox
                                        color="primary"
                                        defaultChecked={remember}
                                        onChange={(e) => setRemember(e)}
                                    />
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs spacing={3}>
                            <Box paddingTop={3} textAlign="right">
                                <Typography><Link style={{textDecoration:'none'}} to="/forgot">Olvidé contraseña</Link></Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box paddingTop={2}>
                                <Typography>No tienes cuenta? <Link style={{textDecoration:'none'}} to="/signin" > Regístrate</Link></Typography>
                            </Box>
                        </Grid>
                    </Grid> 
                </form>
            </div>
            {/* Backdrop */}
            {openBackdrop ? (
                <Backdrop className={styles.backdrop} open={openBackdrop}>
                    <CircularProgress color="inherit" />
                </Backdrop>
               ) : (
                <></>
            )}
            {/* Snackbar */}
            {alerts ? (
                <Snackbar open={alerts} autoHideDuration={3000} onClose={() => setAlerts(false)}>
                    <Alert onClose={() => setAlerts(false)} severity={severity}>
                        <AlertTitle>{severity === 'error' ? 'Error' : 'Success' }</AlertTitle>
                        {messages}
                    </Alert>
                </Snackbar>
            ) : (
                    <></>
                )}
        </main>
    );
}

const styles = theme => ({
    root:{
        zIndex: -1,
        position:'relative',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(),
    },
    submit: {
        marginTop: theme.spacing() * 3,
    },
    backdrop: {
        position: "absolute",
        zIndex: 1,
    },
});

export default Login;