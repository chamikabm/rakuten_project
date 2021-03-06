import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../withRoot';
import moment from 'moment';

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  searchGrid: {
    marginTop: theme.spacing.unit * 2,
  },
});

class Index extends React.Component {
  render() {
    const { classes, filteredData } = this.props;
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
                Search Result:
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
              <table>
                <thead>
                 <th>Shop ID</th>
                 <th>Start Date</th>
                 <th>End Date</th>
                </thead>
                <tbody>
                {
                  filteredData
                      ? filteredData.map(shop => (
                          <tr>
                            <td>{shop.shopId}</td>
                            <td>{moment(`${shop.startDate}`, "YYYYMMDD").format("DD/MM/YYYY")}</td>
                            <td>{moment(`${shop.endDate}`, "YYYYMMDD").format("DD/MM/YYYY")}</td>
                          </tr>))
                      : null
                }
                </tbody>
              </table>
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
