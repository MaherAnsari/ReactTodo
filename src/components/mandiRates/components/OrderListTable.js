import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import '../mandiRate.css';
import Card from '@material-ui/core/Card';

const theme = createMuiTheme({
    overrides: {
        MuiTableCell: {
            head: {
                color: '#fff',
                fontWeight: 600,
                fontSize: '15px !important',
                fontFamily: 'lato !important',
                textTransform: 'uppercase'

            },
            body: {
                color: 'rgba(0, 0, 0, 0.87)',
                fontWeight: 500,
                fontSize: '15px !important',
                fontFamily: 'lato !important',
                lineHeight: '1.5em',
            }
        },
    }
});

const styles = theme => ({
    defaultSpan: { display: 'grid', fontSize: '25px' },
    defaultIcon: { fontSize: '65px', color: "#384952" },
    root: {
        width: '100%',
        minHeight: '80vh',
        fontFamily:'Lato'
    },
    card:{
        minHeight:'60vh'
    }

});


class OrderListTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tableHeadData: ["commodity", "price", "modal price"],
            tableBodyData: this.props.tableData,
            rawTableBodyData: [],
            searchedText: "",
            editableData: {},
            showServerDialog: false,
            showOptionModal: false,
            anchorEl: null,
            showUserModal: false,
            open: false,
            userData: {},
            userId: null,
            payload: null,


        }
    }

    componentWillReceiveProps(nextprops) {

        if (this.state.tableBodyData !== nextprops.tableData) {
            this.setState({ tableBodyData: nextprops.tableData });
        }
    }


    getTableCellClass(classes, index) {
        return classes.tableCell;
    }

    getInfoSTring(obj) {
        return obj.source_location ? obj.source_location : "- , " + obj.target_location ? obj.target_location : "-";
    }

    getRole(row) {
        if (row.role === "ca") {
            return "buyer";
        } else if (row.role === 'la') {
            return "supplier";
        } else if (row.role === 'broker') {
            return "broker";
        } else {
            return "NA";
        }
    }
    getBackgroundColor(obj) {
        if (obj.role === "ca") {
            return "#f94141";
        } else if (obj.role === 'la') {
            return "#82af82";
        } else if (obj.role === 'broker') {
            return "#7070fd";
        } else {
            return "#e5e8ec";
        }
    }
    render() {
        const { classes } = this.props;
        return (
            <MuiThemeProvider theme={theme}>
                <Paper className={classes.root} >
                    {this.state.tableBodyData ? <div >
                        <Card className={classes.card}>
                            <div className="orderList">
                                <div style={{width:"25%"}}>commodity</div>
                                <div style={{width:"50%"}}>Min.  &   Max. Price</div>
                                <div style={{width:"25%"}}>Modal Price</div>
                            </div>
                            <div className="commodityName"><img src="https://bijak-public-images.s3.ap-south-1.amazonaws.com/commodity/potato.png" style={{marginLeft:'25%'}} alt="Smiley face" width="42" height="42" /> 
                            <p className="name">Tomato </p></div>
                            <Card className="detailCard">
                                <div className="commodityDetail">District Name</div>
                                <div className="districtDiv">
                                <div style={{width:"25%"}}>Pamohi</div>
                                <div style={{width:"50%" ,display:'flex'}}>
                                    <p style={{width:"50%"}}>Min: 1200</p>
                                    <p style={{width:"50%"}}>Max: 1299</p>
                                </div>
                                <div style={{width:"25%"}}>2500</div>
                                </div>
                                <div className="districtDiv">
                                <div style={{width:"25%"}}>Pamohi</div>
                                <div style={{width:"50%" ,display:'flex'}}>
                                    <p style={{width:"50%"}}>Min: 1200</p>
                                    <p style={{width:"50%"}}>Max: 1299</p>
                                </div>
                                <div style={{width:"25%"}}>2500</div>
                                </div>
                            </Card>
                                        </Card>
                        
                    </div> :
                        <div style={{paddingTop: "14%"}} >
                            <span className={classes.defaultSpan}>
                                <i className={classes.defaultIcon + " fa fa-search-plus"} aria-hidden="true"></i>{"Search from above to check specific commodity"}</span>
                        </div>
                    }
                    

                </Paper>
            </MuiThemeProvider>
        );
    }
}

OrderListTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OrderListTable);