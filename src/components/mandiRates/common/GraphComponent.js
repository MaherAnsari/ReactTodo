import React from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import Card from '@material-ui/core/Card';

var Chart = require("chart.js");
var mixedChart = undefined;

const styles = theme => ({
    root: {
        flexGrow: 1
    }
});


class GraphComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            graphData : this.props.graphData
        }

    }

    
  componentDidMount() {
    this.configureChart( this.state.graphData );
  }

  configureChart = ( data ) => {

    var line1Data = [];
    var line2Data = [];
    var line3Data = [];
    var label1= "Min";
    var label2= "Max";
    var label3= "Modal Price";
    var chartLabels = [];
    var lineColor1= "rgb(0, 0, 255)";
    var lineColor2= "rgb(0, 116, 140)";
    var lineColor3= "rgb(221, 46, 29)";


    for( var i = 0; i < data.length; i++ ){
        line1Data.push( data[i]["cost"].indexOf("-") > -1 ? data[i]["cost"].split("-")[0] : 0 );
        line2Data.push( data[i]["cost"].indexOf("-") > -1 ? data[i]["cost"].split("-")[1] : 0 );
        line3Data.push( data[i]["modal_price"] );
        chartLabels.push( data[i]["arrival_date"] )
    }

    const chartCanvas = this.node;
    mixedChart = new Chart(chartCanvas, {
      type: "line",
      data: {
        datasets: [
          {
            label: label1,
            data: line1Data,
            type: "line",
            borderColor: lineColor1,
            fill: false,
            pointBorderColor: '#111',
            pointBackgroundColor: '#ff4000',
            pointBorderWidth: 2,
          },
          {
            label: label2,
            data: line2Data,
            type: "line",
            fill: false,
            borderColor: lineColor2,
            pointBorderColor: '#111',
            pointBackgroundColor: '#ff4000',
            pointBorderWidth: 2,
          },
          {
            label: label3,
            data: line3Data,
            type: "line",
            fill: false,
            borderColor: lineColor3,
            pointBorderColor: '#111',
            pointBackgroundColor: '#ff4000',
            pointBorderWidth: 2,
          },
        ],
        labels: chartLabels
      },
      options: {
        elements: {
          line: {
            tension: 0.000001
          }
        },
        tooltips: {
          displayColors: false
        },
        legend: {
          display: true,
          position: "bottom"
        },
        scales: {
          yAxes: [
            {
              display: true,
              // stacked: true,
              ticks: {
                beginAtZero: true
              }
            }
          ],
          xAxes: [
            {
              display: true,
              stacked: true,
              barThickness: 25,
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });
  };

    componentWillUnmount = () => {
        if (mixedChart) { mixedChart.destroy(); }
        mixedChart = undefined;
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root} id="chartjs"
                style={{
                    flex: 1,
                    display: 'flex' 
                }}>
                {
                    <Card style={{ width: "100%", marginRight: 12 }} >
                        {this.state.graphData && 
                        <Grid container direction="row" style={{ padding: "4px 15px 15px 15px", background: "#fff"}} >
                            <Grid item md={12}>
                                <div style={{ display: "flex" }}>
                                    <canvas
                                        style={{ width: '100%', height: 400, marginLeft: "-10px" }}
                                        ref={node => (this.node = node)} />
                                </div>
                            </Grid>
                        </Grid>}
                    </Card>
                }
            </div>
        );
    }
}

GraphComponent.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(GraphComponent);
