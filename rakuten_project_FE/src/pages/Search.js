import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import CloudUpload from '@material-ui/icons/CloudUpload';
import Search from '@material-ui/icons/Search';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../withRoot';
import axios from 'axios';

const endpoint = '/upload';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  container: {
    display: 'flex',
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
    filterdData:[]
  };

  handleOnError = (error) => {
    let newState = Object.assign({}, this.state);
    newState.errorMessage = error;
    newState.open =true;
    this.setState(newState)
  };

  handleClose = () => {
    let newState = Object.assign({}, this.state);
    newState.open= false;
    newState.loaded = 0;
    newState.selectedFile= null;
    this.setState(newState)
  };

  handleselectedFile = event => {

    let newState = Object.assign({}, this.state);
    newState.selectedFile = event.target.files[0];
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
        .then(res => {
          console.log(res.statusText)
        }).catch(this.handleOnError)
    }
  };

  handleClick = () => {
    let newState = Object.assign({}, this.state);
    newState.open = true;
    this.setState(newState)
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.container}>
          <Grid container spacing={24}
          >
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Typography variant="h5" gutterBottom>
                  Search for Shops:
                </Typography>

              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} alignItems={"center"} justify={"center"}>
              <Button color={"primary"} variant="contained" className={classes.button} onClick={this.handleUpload}>
                Search
                <Search className={classes.rightIcon} />
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Index));
