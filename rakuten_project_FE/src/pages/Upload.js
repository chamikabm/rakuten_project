import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import CloudUpload from '@material-ui/icons/CloudUpload';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../withRoot';
import moment from 'moment';
import axios from 'axios';
import Search from './Search';
import Result from './Result';

const endpoint = '/upload';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  input: {
    display: 'none',
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  button: {
    margin: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  menuButton: {
    marginLeft: -18,
    marginRight: 10,
  },
});

class Index extends React.Component {
  state = {
    open: false,
    selectedFile: null,
    loaded: 0,
    errorMessage: "",
    data:[],
    filteredData:[],
    fileUploaded: true,
    hasResults: false,
  };

  handleOnFilter = (selectedDate) => {
    const currentList = this.state.data;
    let filteredData = [];
    if(selectedDate) {
      const currentDateStamp = selectedDate.format("YYYYMMDD");
      console.log(currentDateStamp);
      filteredData =  currentList.filter(
          (shop)=> shop.startDate <= currentDateStamp && shop.endDate >= currentDateStamp)

    } else {
       filteredData  = currentList;
    }
    let newState = Object.assign({}, this.state);
    newState.filteredData = filteredData;
    this.setState(newState);
  };

  handleOnError = (error) => {
    let newState = Object.assign({}, this.state);
    newState.errorMessage = error.response.data;
    newState.open = true;
    newState.hasResults = false;
    this.setState(newState)
  };

  handleClose = () => {
    let newState = Object.assign({}, this.state);
    newState.open= false;
    newState.loaded = 0;
    newState.selectedFile= null;
    this.setState(newState)
  };

  handleOnData = (response) => {
    let newState = Object.assign({}, this.state);
    newState.data= response.data;
    newState.filteredData = response.data;
    newState.hasResults = true;
    this.setState(newState)
  };

  handleSelectedFile = event => {
    let newState = Object.assign({}, this.state);
    newState.selectedFile = event.target.files[0];
    newState.data = [];
    newState.errorMessage = "";
    newState.filteredData = [];
    newState.hasResults = false;
    this.setState(newState)
  };

  handleOnProgress = ProgressEvent => {
    let newState = Object.assign({}, this.state);
    newState.loaded = (ProgressEvent.loaded / ProgressEvent.total) * 100;
    this.setState(newState);
  };

  handleUpload = () => {
    if (this.state.selectedFile) {
      const data = new FormData();
      data.append('file', this.state.selectedFile, this.state.selectedFile.name);
      axios
        .post(endpoint, data, {
          onUploadProgress: this.handleOnProgress
        })
        .then(this.handleOnData)
        .catch(this.handleOnError)
    }
  };

  handleClick = () => {
    let newState = Object.assign({}, this.state);
    newState.open = true;
    this.setState(newState)
  };

  render() {
    const { classes } = this.props;
    const { open, selectedFile, errorMessage, data, filteredData } = this.state;
    return (
      <div className={classes.root}>
        <Dialog open={open} onClose={this.handleClose}>
          <DialogTitle>Error Occurred During File Uploading..</DialogTitle>
          <DialogContent>
            <DialogContentText>{errorMessage}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleClose}>
              OK
            </Button>
          </DialogActions>
        </Dialog>

        <div>
          <AppBar position="static">
            <Toolbar variant="dense">
              <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" color="inherit">
                My Shops
              </Typography>
            </Toolbar>
          </AppBar>
        </div>
        <div>
          <Grid container
                direction="column"
                justify="center"
                alignItems="stretch"
          >
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Typography variant="h5" gutterBottom>
                  File to Upload:
                </Typography>
              </Paper>
            </Grid>
            <Grid xs={12}
                  container
                  justify="center"
                  alignItems={"center"}
            >
              <Grid item>
                <input
                  style={{ display: 'none' }}
                  variant="contained"
                  component="span"
                  accept="*.csv"
                  id="contained-button-file"
                  multiple={false}
                  className={classes.button}
                  type="file"
                  onChange={this.handleSelectedFile}
                />

                <label htmlFor="contained-button-file">
                  <Button variant="outlined" color="primary" component="span" className={classes.button}>
                    Choose file
                  </Button>
                </label>
                {selectedFile
                    ? <Typography variant="h5" >
                      {selectedFile.name}
                    </Typography>
                    : null
                }
              </Grid>
            </Grid>
            <Grid xs={12}
                  container
                  justify="center"
                  alignItems={"center"}
            >
              <Grid item>
                <Button color={"primary"} variant="contained" className={classes.button} onClick={this.handleUpload}>
                  Upload
                  <CloudUpload className={classes.rightIcon} />
                  &nbsp;&nbsp;{Math.round(this.state.loaded, 2)} %
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </div>
        {
          this.state.hasResults ? <Search handleOnFilter={this.handleOnFilter}/> : null
        }
        {
          this.state.hasResults ? <Result filteredData={filteredData}/> : null
        }
      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Index));
