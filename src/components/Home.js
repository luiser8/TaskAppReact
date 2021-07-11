import React, { useEffect, useState, Fragment } from 'react';
import '../utils/Config';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Select from '@material-ui/core/Select';
import { Edit, Delete, ViewArray } from '@material-ui/icons';
import { Alert, AlertTitle } from '@material-ui/lab';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
    IconButton,
    MenuItem,
    Avatar,
    Button,
    FormControl,
    Input,
    InputLabel,
    Paper,
    Typography,
    ListItem,
    List,
    Chip,
} from '@material-ui/core';

const Home = ({ user }) => {
    var [tasks, setTasks] = useState([]);
    var classes = useStyles();
    var [messages, setMessages] = useState('');
    var [btnAdd, setBtnAdd] = useState(true);
    var [open, setOpen] = React.useState(false);
    var [openDialog, setOpenDialog] = useState(false);
    var [idTask, setIdTask] = useState('');
    var [name, setName] = useState('');
    var [priority, setPriority] = useState('');
    var [description, setDescription] = useState('');

    const editHandle = (task) => {
        setBtnAdd(false);
        setIdTask(task.IdTask); setName(task.Name); setPriority(task.Priority); setDescription(task.Description);
    }

    const clearInputs = () => {
        setName(''); setPriority(''); setDescription('');
    }

    const handleUpdate = async (event) => {
        event.preventDefault();
        await fetch(`${global.config.url.dev}Tasks/${idTask}`, {
            method: 'PUT',
            headers: global.config.headers.dev,
            body: JSON.stringify(
                {
                    'IdTask': idTask,
                    'IdUser': user,
                    'Name': name,
                    'Priority': priority,
                    'Description': description
                }
            ),
            json: true
        }).then(() => {
            fetch(`${global.config.url.dev}Tasks?user=${user}`)
                .then(response => response.json())
                .then(res => {
                    return setTasks(res)
                })
                .catch(e => console.log(e))
        }).catch(e => console.log(e));
        clearInputs(); setMessages('Se ha actualizado una tarea'); setBtnAdd(true);
        setTimeout(() => {
            setMessages('');
        }, 2000)
    }

    const getTasks = async () => {
        var result = await fetch(`${global.config.url.dev}Tasks?user=${user}`, {
            method: 'GET',
            headers: global.config.headers.dev,
            json: true
        }).then(response => {
            if (response.status >= 200 && response.status <= 299) {
                return response.json()
            }
        }).catch(e => console.log(e))
        if (result == null) {
            return "Error get";
        } else {
            return setTasks(result)
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        await fetch(`${global.config.url.dev}Tasks`, {
            method: 'POST',
            headers: global.config.headers.dev,
            body: JSON.stringify({ 'IdUser': user, 'Name': name, 'Priority': priority, 'Description': description }),
            json: true
        }).then(() => {
            fetch(`${global.config.url.dev}Tasks?user=${user}`)
                .then(response => response.json())
                .then(res => {
                    return setTasks(res)
                })
                .catch(e => console.log(e))
        }).catch(e => console.log(e));
        clearInputs(); setMessages('Se ha creado una nueva tarea');
        setTimeout(() => {
            setMessages('');
        }, 2000)
    }

    const delTask = async (task) => {
        console.log(task)
        await fetch(`${global.config.url.dev}Tasks/${task}`, {
            method: 'DELETE',
            headers: global.config.headers.dev,
            json: true
        }).then(() => {
            fetch(`${global.config.url.dev}Tasks?user=${user}`)
                .then(response => response.json())
                .then(res => {
                    return setTasks(res)
                })
                .catch(e => console.log(e))
        }).catch(e => console.log(e));
        clearInputs(); setMessages('Se ha eliminado una tarea'); setBtnAdd(true); setOpenDialog(false);
        setTimeout(() => {
            setMessages('');
        }, 2000)
    }

    useEffect(() => {
        getTasks();
    }, [])

    return (
        <Grid container spacing={0}>
            {(Object.keys(tasks).length !== 0) ?
                <Grid item xs={6}>
                    <Paper className={classes.paper}>
                        <List>
                            {tasks.map((key, item) => (
                                <Fragment>
                                    <ListItem alignItems="flex-start">
                                        <ListItemAvatar>
                                            <Chip label={tasks[item].Priority} />

                                        </ListItemAvatar>
                                        <ListItemText
                                            onClick={() => editHandle(
                                                {
                                                    'IdTask': tasks[item].IdTask,
                                                    'Name': tasks[item].Name,
                                                    'Priority': tasks[item].Priority,
                                                    'Description': tasks[item].Description
                                                }
                                            )}
                                            primary={tasks[item].Name}
                                            secondary={
                                                <React.Fragment>
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        className={classes.inline}
                                                        color="textPrimary">
                                                        Autor
                                                  </Typography>
                                                  : - {tasks[item].Description}
                                                  : - {tasks[item].CreateTask}
                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>
                                    <IconButton onClick={() => setOpenDialog(true)}><Delete /></IconButton>
                                    <>
                                        <Dialog
                                            open={openDialog}
                                            onClose={() => setOpenDialog(false)}
                                            aria-labelledby="alert-dialog-title"
                                            aria-describedby="alert-dialog-description"
                                        >
                                            <DialogTitle id="alert-dialog-title">{"Estas seguro que deseas eliminar la tarea?"}</DialogTitle>
                                            <DialogContent>
                                                <DialogContentText id="alert-dialog-description">
                                                    Si eliminas la tarea no podras recuperarla
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={() => setOpenDialog(false)} color="primary">
                                                    Cancelar
                                                </Button>
                                                <Button onClick={() => delTask(tasks[item].IdTask)} color="primary" autoFocus>
                                                    Aceptar
                                                </Button>
                                            </DialogActions>
                                        </Dialog>
                                    </>
                                    <Divider variant="inset" component="li" />
                                </Fragment>
                            ))}

                        </List>
                    </Paper>
                </Grid>
                :
                <Grid item xs={6}>
                    <CircularProgress disableShrink />
                </Grid>
            }

            <Grid item xs={6}>
                <Paper className={classes.paper}>
                    <form onSubmit={btnAdd ? handleSubmit : handleUpdate}>
                        <FormControl margin="normal" required fullWidth>
                            <InputLabel htmlFor="cedula">Nombre</InputLabel>
                            <Input
                                id="email"
                                name="email"
                                type="text"
                                autoComplete="email"
                                autoFocus
                                onChange={(event) => setName(event.target.value)}
                                value={name}
                            />
                        </FormControl>
                        <FormControl margin="normal" required fullWidth>
                            <InputLabel id="demo-controlled-open-select-label">Prioridad</InputLabel>
                            <Select
                                labelId="demo-controlled-open-select-label"
                                id="demo-controlled-open-select"
                                open={open}
                                onClose={() => setOpen(false)}
                                onOpen={() => setOpen(true)}
                                value={priority}
                                onChange={(event) => setPriority(event.target.value)}
                            >
                                <MenuItem value="Alta">Alta</MenuItem>
                                <MenuItem value="Medio">Medio</MenuItem>
                                <MenuItem value="Baja">Baja</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl margin="normal" required fullWidth>
                            <InputLabel htmlFor="password">Descripcion</InputLabel>
                            <Input
                                name="password"
                                type="text"
                                id="password"
                                autoComplete="current-password"
                                onChange={(event) => setDescription(event.target.value)}
                                value={description}
                            />
                        </FormControl>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                        >
                            {btnAdd ? 'Agregar' : 'Editar'}
                        </Button>
                    </form>
                    {(messages !== '') ?
                        <Alert severity="success">
                            <AlertTitle>Success</AlertTitle>
                            {messages} — <strong>ver</strong>
                        </Alert>
                        :
                        <></>
                    }

                </Paper>
            </Grid>
        </Grid>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: '36ch',
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    }
}));

export default Home;