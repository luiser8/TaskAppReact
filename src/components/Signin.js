import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Alert, AlertTitle } from '@material-ui/lab';
import {
    Box,
    Button,
    FormControl,
    Typography,
    TextField,
    Backdrop,
    CircularProgress,
    Snackbar,
} from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { Link } from '@reach/router';
import '../utils/Config';

const Signin = () => {
    const { register, formState, handleSubmit, reset, errors } = useForm({ mode: "onChange" });
    const [alerts, setAlerts] = useState(false);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [messages, setMessages] = useState('');
    const [severity, setSeverity] = useState('');
    const [btn, setBtn] = useState(true);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const checkEmail = async (event) => {
        await fetch(`${global.config.url.dev}Users?email=${event}`, {
            method: 'GET',
            headers: global.config.headers.dev,
            json: true
        }).then(response => {
            if (response.status >= 200 && response.status <= 299) {
                return setCheckEmail(event, response.json());
            }
        }).catch(e => console.log(e))
    }

    const setCheckEmail = async (event, req) => {
        (await Promise.all([req])).map((items) => {
            console.log(items)
            if (!items) {
                setBtn(false);
                setEmail(event);
            } else {
                setBtn(true);
                setEmail(event);
                setAlerts(true);
                setMessages('Este Email esta usado!');
                setSeverity('error');
            }
        })
    }

    const createUser = async (data) => {
        setOpenBackdrop(true);
        await fetch(`${global.config.url.dev}Users`, {
            method: 'POST',
            headers: global.config.headers.dev,
            body: JSON.stringify(
                { 
                    'FirstName': data.firstName, 
                    'LastName': data.lastName, 
                    'Email': data.email, 
                    'Password': data.password 
                }
            ),
            json: true
        }).then(response => {
            if (response.status >= 200 && response.status <= 299) {
                return response.json()
            }
        }).catch(e => console.log(e))
        setFirstName(''); setLastName(''); setEmail(''); setPassword('');
        setAlerts(true); setMessages('Se ha creado tu cuenta'); setSeverity('success');
        setTimeout(() => {
            setAlerts(false); setMessages(''); setOpenBackdrop(false);
        }, 2000);
        reset();
    }

    return (
        <main style={{ width: '60%', margin: '0 auto', marginTop: '40px', flexGrow:1 }}>
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
                        <AlertTitle>{severity === 'error' ? 'Error' : 'Success'}</AlertTitle>
                        {messages}
                    </Alert>
                </Snackbar>
            ) : (
                <></>
            )}
            {/* {(messages !== '') ?
                <Alert severity={severity}>
                    <AlertTitle>{alert}</AlertTitle>
                    {messages}
                </Alert>
                :
                <></>
            } */}
            <Grid container spacing={1} direction="row" justify="center" alignItems="center">
                <Grid item lg={10} md={10} xs={10}></Grid>
                <Grid item lg={10} md={10} xs={10}>
                    <Typography component="h1" variant="h5">
                        Registro de usuario
                    </Typography>
                    <form onSubmit={handleSubmit(createUser)}>
                        <FormControl margin="normal" required fullWidth>
                            <TextField
                                label="Nombres"
                                type="text"
                                name="firstName"
                                autoComplete="nombre"
                                margin="normal"
                                variant="standard"
                                error={!!errors.firstName}
                                defaultValue={firstName}
                                inputRef={register({
                                    required: true,
                                    minLength: {
                                        value: 3,
                                    }
                                })}
                            />
                            {(errors.firstName) ?
                                <Alert severity="error">
                                    <AlertTitle>Error</AlertTitle>
                                    <strong>{errors.firstName && 'Debes colocar los nombres de usuario'}</strong>
                                </Alert>
                                :
                                <></>
                            }
                        </FormControl>
                        <FormControl margin="normal" required fullWidth>
                            <TextField
                                label="Apellidos"
                                type="text"
                                name="lastName"
                                autoComplete="apellido"
                                margin="normal"
                                variant="standard"
                                error={!!errors.lastName}
                                defaultValue={lastName}
                                inputRef={register({
                                    required: true,
                                    minLength: {
                                        value: 3,
                                    }
                                })}
                            />
                            {(errors.lastName) ?
                                <Alert severity="error">
                                    <AlertTitle>Error</AlertTitle>
                                    <strong>{errors.lastName && 'Debes colocar los apellidos de usuario'}</strong>
                                </Alert>
                                :
                                <></>
                            }
                        </FormControl>
                        <FormControl margin="normal" required fullWidth>
                            <TextField
                                label="Email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                margin="normal"
                                variant="standard"
                                error={!!errors.email}
                                defaultValue={email}
                                onChange={(event) => checkEmail(event.target.value)}
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
                                label="Contraseña"
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
                            disabled={!formState.isValid ? !formState.isValid : btn}
                        > Guardar
                            </Button>
                        <Box paddingTop={2}>
                            <Typography>Tienes cuenta? <Link style={{ textDecoration: 'none' }} to="/" > Inicia sesión</Link></Typography>
                        </Box>
                    </form>
                </Grid>
                <Grid item lg={10} md={10} xs={12}></Grid>
            </Grid>
        </main>
    );
}

const styles = makeStyles((theme) => ({
    container: {
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridGap: theme.spacing(3),
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        whiteSpace: 'nowrap',
        marginBottom: theme.spacing(1),
    },
    divider: {
        margin: theme.spacing(2, 0),
    },
    backdrop: {
        position: "absolute",
        zIndex: 1,
    },
}));

export default Signin;
