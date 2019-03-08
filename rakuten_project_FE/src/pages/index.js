import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../withRoot';
import axios from 'axios'


const endpoint = '/upload'

const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 20,
  },
  input: {
      display: 'none',
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

class Index extends React.Component {
  state = {
    open: false,
    selectedFile: null,
    loaded: 0,
    errorMessage: "",
    data:[],
    filterdData:[]
  };

  handleOnError = (error) => {
    let newState = Object.assign({}, this.state);
    newState.errorMessage = error;
    newState.open =true;
    this.setState(newState)
  }

  handleClose = () => {
    let newState = Object.assign({}, this.state);
    newState.open= false;
    newState.loaded = 0
    newState.selectedFile= null
    this.setState(newState)
  };

  handleselectedFile = event => {

    let newState = Object.assign({}, this.state);
    newState.selectedFile = event.target.files[0]
    this.setState(newState)
  }

  handleOnProgress = ProgressEvent => {
    let newState = Object.assign({}, this.state);
    newState.loaded = (ProgressEvent.loaded / ProgressEvent.total) * 100;
    this.setState(newState);
  }

  handleUpload = () => {
    if (this.state.selectedFile) {
      const data = new FormData()
      data.append('file', this.state.selectedFile, this.state.selectedFile.name);
      axios
        .post(endpoint, data, {
          onUploadProgress: this.handleOnProgress
        })
        .then(res => {
          console.log(res.statusText)
        }).catch(this.handleOnError)
    }
    }
  handleClick = () => {
    let newState = Object.assign({}, this.state);
    newState.open = true;
    this.setState(newState)
  };

  render() {
    const { classes } = this.props;
    const { open, selectedFile, errorMessage, data, filterdData } = this.state;
    return (
      <div className={classes.root}>
        <Dialog open={open} onClose={this.handleClose}>
          <DialogTitle>Error Occured During</DialogTitle>
          <DialogContent>
            <DialogContentText>errorMessage</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleClose}>
              OK
            </Button>
          </DialogActions>
        </Dialog>
        <Grid
          container
          spacing={24}
        >
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <table>
              <tbody>
              <tr>
                <td>
                  <Typography variant="subtitle1" gutterBottom>
                   File to Upload:
                  </Typography>
                </td>
                <td>
                <Button
                  containerElement='label'
                  label='My Label'>
                  <input
                        variant="contained"
                        component="span"
                        accept="*.csv"
                        id="contained-button-file"
                        multiple={false}
                        className={classes.button}
                        type="file"
                        onChange={this.handleselectedFile}
                  />
                </Button>
                </td>
              <td>
                <div>
                  <Button color="primary" onClick={this.handleUpload} >Submit
                </Button>
              {Math.round(this.state.loaded, 2)} %</div>
          </td>
          </tr>
        </tbody>
            </table>

        </Paper>
        </Grid>

        </Grid>


      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Index));
