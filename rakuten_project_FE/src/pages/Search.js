import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Search from '@material-ui/icons/Search';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { DatePicker, MuiPickersUtilsProvider } from "material-ui-pickers";
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import withRoot from '../withRoot';

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  searchGrid: {
    marginTop: theme.spacing.unit * 2,
  },
  button: {
    margin: theme.spacing.unit,
  },
});

class Index extends React.Component {
  state = {
    selectedDate: moment(Date())
  };

  handleDateChange = (date) => {
    this.setState({ selectedDate: date });
  };

  render() {
    const { classes, handleOnFilter } = this.props;
    return (
      <div>
          <Grid container
                direction="column"
                justify="center"
                alignItems="stretch"
          >
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Typography variant="h5" gutterBottom>
                  Search for Shops:
                </Typography>
              </Paper>
            </Grid>
            <Grid xs={12}
                  container
                  justify="center"
                  alignItems={"center"}
                  className={classes.searchGrid}
            >
              <Grid item>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <DatePicker
                    value={this.state.selectedDate}
                    onChange={this.handleDateChange}
                    label="Date of birth"
                    openTo="year"
                    format={"DD/MM/YYYY"}
                    views={["year", "month", "day"]}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item>
                <Button color={"primary"} variant="contained" className={classes.button} onClick={()=>{
                  handleOnFilter(this.state.selectedDate);
                }}>
                  Search
                  &nbsp;<Search className={classes.rightIcon} />
                </Button>
              </Grid>
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
