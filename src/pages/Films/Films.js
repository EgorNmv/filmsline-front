import React, {useEffect, useState} from "react";
import {Link, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import Container from "@material-ui/core/Container";
import {makeStyles} from '@material-ui/core/styles';
import paths from "../../routes/paths";
import {getAllFilms, postFilm} from "../../actions/filmActions";
import {TextField, Dialog, DialogActions, DialogContent, DialogTitle, Button} from "@material-ui/core";


const useStyles = makeStyles(theme => ({
    main: {
        marginTop: theme.spacing(8),
        marginBottom: theme.spacing(2),
    }
}));

const connectActions = {getAllFilms, postFilm};

const mapStateToProps = state => ({
    filmsList: state.film.filmsList,
    userType: state.auth.user.type,
    userName: state.auth.user.username,
    userId: state.auth.user._id,
    userFilms: state.auth.user && state.auth.user.films
});

function Films({getAllFilms, filmsList, userType, postFilm, userName, userId, userFilms}) {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(null);
    const [description, setDescription] = useState(null);
    const [img, setImg] = useState(null);
    const [rentalStart, setRentalStart] = useState(null);
    const [rentalEnd, setRentalEnd] = useState(null);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const _postFilm = (e) => {
        e.preventDefault();
        postFilm(name, description, img, userName, userId, handleClose, rentalStart, rentalEnd);
    };
    useEffect(() => {
        getAllFilms();
    }, []);

    return <Container component="main" className={classes.main} maxWidth="sm" style={{paddingTop: 50}}>
        <span style={{fontSize: 30, fontWeight: 500}}>Films</span>
        {userFilms.length > 0 && (
            <div style={{paddingBottom: 10}}>
                <span style={{
                    fontSize: 20,
                    fontWeight: 300
                }}>My films: {userFilms.map(film => (film.film_name + "; "))}</span>
            </div>)}
        {userType === 1 && (
            <div>
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleClickOpen}
                >
                    Add new film
                </Button>
                <Dialog
                    fullWidth
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">
                        Add new film
                    </DialogTitle>
                    <DialogContent style={{display: "flex", flexDirection: "column"}}>
                        <TextField label="Film name*" style={{paddingBottom: 20}}
                                   onChange={e => setName(e.target.value)}/>
                        <TextField label="Film description*" style={{paddingBottom: 20}}
                                   onChange={e => setDescription(e.target.value)}/>
                        <TextField label="Link to film poster*" style={{paddingBottom: 20}}
                                   onChange={e => setImg(e.target.value)}/>
                        <TextField label="Rental start" style={{paddingBottom: 20}}
                                   onChange={e => setRentalStart(e.target.value)}/>
                        <TextField label="Rental end"
                                   onChange={e => setRentalEnd(e.target.value)}/>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={e => _postFilm(e)}
                            disabled={!name || !description || !img}
                        >
                            Add
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>)}
        {filmsList.length > 0 ? <div
            style={{display: "flex", width: "100%", flexDirection: "column"}}>{filmsList.map(film => (
            <Link to={paths.CurrentFilm.toPath({film_id: film._id})} key={film._id}>
                <div
                    style={{
                        boxShadow: "1px 1px 4px -2px #000",
                        padding: 10,
                        borderRadius: 5,
                        margin: "10px 0 0 0",
                        display: "flex",
                        position: "relative"
                    }}>{film.name}</div>
            </Link>
        ))}</div> : <div>No films yet</div>}
    </Container>
}

export default withRouter(
    connect(
        mapStateToProps,
        connectActions
    )(Films)
);