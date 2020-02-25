import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import '../mandiRate.css';
import Card from '@material-ui/core/Card';
import Icon from '@material-ui/core/Icon';
import MandiGraphModal from '../common/MandiGraphModal';
var moment = require('moment');

const theme = createMuiTheme({
    overrides: {
        MuiTableCell: {
            head: {
                color: '#2e3247',
                fontWeight: 600,
                fontSize: '13px !important',
                fontFamily: 'lato !important',
                textTransform: 'uppercase',
                lineHeight: "1em"

            },
            body: {
                color: 'rgba(0, 0, 0, 0.87)',
                fontWeight: 500,
                fontSize: '14px !important',
                fontFamily: 'lato !important',
            }
        },
         MuiTablePagination: {
            toolbar:{
              paddingRight:'200px'
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
        fontFamily: 'Lato'
    },
    card: {
        minHeight: '60vh'
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

            showGraphModal: false,
            graphPayloads: {}

        }
    }

    componentWillReceiveProps(nextprops) {
        // console.log(nextprops.tableData);
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

    onGraphViewClicked( data , commodity,  event ){
        var paylaods = {
            market: data["market"],
            commodity:  commodity,
            lang:  "hindi", //data[],
            days:  10
        }
        try{
            this.setState({ graphPayloads : paylaods }, function(){
                this.setState({ showGraphModal : true })
            });
        }catch(err){
            console.log( err );
        }
    }

    formatDateAndTime = (dateval) => {
        var fdate = moment.utc(new Date(dateval)).utcOffset("+05:30").format('DD-MMM-YYYY')
        // return <div style={{ width: "95px" }}> {fdate.split(" ")[0] }</div>
        // + " \n" +   fdate.split(" ")[1] + " " + fdate.split(" ")[2]
        return <div style={{ width: "95px", display: "inline-block" }}> {fdate.split(" ")[0] }</div>
    }

    getBackgroundColor(obj) {
        if (obj.source === "datagov") {
            return "#2698d8";
        } else if (obj.source === 'enam') {
            return "#00a700";
        } else  {
            return "#e84089";
        } 
      
    }
    render() {
        const { classes } = this.props;
        return (
            <MuiThemeProvider theme={theme}>
                <Paper className={classes.root} >
                    {Object.keys(this.state.tableBodyData).length > 0 ? <div  >
                        <Card className={classes.card}>
                            <div className="orderList">
                                <div style={{ width: "25%" }}>commodity</div>
                                <div style={{ width: "40%",textAlign:'right' }}>Min.  &   Modal Price</div>
                                <div style={{ width: "25%",textAlign:'right' }}>Max Price</div>
                            </div>
                            <div style={{maxHeight:"70vh",overflowY:"scroll"}} >
                            {Object.keys(this.state.tableBodyData).map((option) => {
                                return (<div  key={ option } >
                                    <div className="commodityName"><img src={this.state.tableBodyData[option][0]['image_url']} style={{ marginLeft: '5%' }} 
                                    onError={(e)=>{e.target.onerror = null; e.target.src="https://bijakteaminternal-userfiles-mobilehub-429986086.s3.ap-south-1.amazonaws.com/public/no_data_found.png" }}
                                    alt="Smiley face" width="42" height="42" />
                                        <p className="name" style={{textTransform: "capitalize"}}>{option} </p></div>
                                    <Card className="detailCard">
                                        <div className="commodityDetail">Market Name</div>
                                        {this.state.tableBodyData[option].map((row, i) => {
                                            return (<div key={"data_"+i} className="districtDiv">
                                                <div style={{ width: "40%" ,display: 'flex',textAlign:'right'}}>
                                                <p style={{ width: "30%" }}>{this.formatDateAndTime(row.arrival_date)} </p>
                                                <p style={{  color: "white",minWidth:'65px',textAlign:'center',
                                                            background:this.getBackgroundColor(row),fontSize:'12px',
                                                            padding: "1px 12px",width:'fit-content',
                                                            borderRadius: "13px"}}>{row.source} </p>
                                                    <p style={{ width: "55%" }}> {row.market}</p>
                                                </div>
                                                <div style={{ width: "35%", display: 'flex',textAlign:'right' }}>
                                                    <p style={{ width: "50%" }}> ₹ {row.cost ? row.cost.split('-')[0]:"-"}</p>
                                                    <p style={{ width: "50%" }}> ₹ {row.modal_price}</p>
                                                </div>
                                                <div style={{ width: "20%" ,textAlign:'right'}}>₹ {row.cost ? row.cost.split('-')[1] :"-"}</div>
                                                <div style={{ width: "10%" }}>
                                                    <Icon className={classes.iconHover} color="error" style={{ cursor:"pointer",fontSize: 30 }} onClick={ this.onGraphViewClicked.bind( this, row , option )} >
                                                        trending_up
                                                    </Icon>
                                                </div>
                                            </div>
                                            )
                                        })}
                                    </Card>
                                </div>
                                )
                            })}
                            </div>
                        </Card>
                    </div> :
                        <div style={{ paddingTop: "14%" }} >
                            <span className={classes.defaultSpan}>
                                <i className={classes.defaultIcon + " fa fa-search-plus"} aria-hidden="true"></i>{"Search from above to check specific commodity"}</span>
                        </div>}

                    {this.state.showGraphModal &&
                        <MandiGraphModal
                            openModal={this.state.showGraphModal}
                            graphPayloads={ this.state.graphPayloads }
                            onModalClose={() => this.setState({ showGraphModal: false })} />}
                </Paper>
            </MuiThemeProvider>
        );
    }
}

OrderListTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OrderListTable);