import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button';
import ReactDOM from 'react-dom';
import FormControl from '@material-ui/core/FormControl';
import AsyncSelect from 'react-select/lib/Async';
import buyerService from '../../../app/buyerService/buyerService';
import supplierService from '../../../app/supplierService/supplierService';
import brokerService from '../../../app/brokerService/brokerService';
import Badge from '@material-ui/core/Badge';
import UserFilterOption from "../common/UserFilterOption";

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: '0px 5px',
        padding: '0px 10px',
        minWidth: 120,
        color: '#373737 !important',
        borderRight: '1px solid #e6e7e8'
    },
    'input': {
        '&::placeholder': {
            color: 'blue'
        }
    },
    bgColor: {
        "& > *": {
            // display: "inline-block",
            fontWeight: "600",
            fontFamily: "Montserrat",
            fontSize: "12px",
            color: "#3e5569",
        }
    }
});

class FilterAreaComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            buyerid: [],
            brokerid: [],
            supplierid: [],
            labelWidth: 0,
            configData: [
                { name: "Buyer", id: "buyerid", options: this.props.buyersList },
                { name: "Broker", id: "brokerid", options: this.props.brokersList },
                { name: "Supplier", id: "supplierid", options: this.props.suppliersList }
            ],
            inputValue: "",
            date: new Date(),
            filterOptionData: {},
        }
    }

    componentDidMount() {

        if (this.InputLabelRef) {
            this.setState({
                labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
            });
        }
    }



    componentWillReceiveProps(nextprops) {
        var data = this.state.configData;
        if (nextprops.buyersList !== data[0]["options"] || nextprops.brokersList !== data[0]["options"] || nextprops.suppliersList !== data[0]["options"]) {
            data[0]["options"] = nextprops.buyersList;
            data[1]["options"] = nextprops.brokersList;
            data[2]["options"] = nextprops.suppliersList;
            this.setState({ configData: data });
        }
    }

    getDataBasedOnFilters = () => {
        let data = {
            state: this.state.stateid["value"],
            district: this.state.districtid["value"],
            searchVal: this.state.searchedTxt
        }
        // console.log(data);
        if (data["state"] === "") {
            delete data["state"];
        }
        if (data["district"] === "") {
            delete data["district"];
        }
        if (!data["searchVal"] || data["searchVal"] === "") {
            delete data["searchVal"];
        }

        if (this.props.role) {
            data['role'] = this.props.role;
        }
        if (Object.keys(this.state.filterOptionData).length > 0) {
            for (var keys in this.state.filterOptionData) {
                if (this.state.filterOptionData[keys] === "Yes") {
                    data[keys] = true;
                } else if (this.state.filterOptionData[keys] === "No") {
                    data[keys] = false;
                } else {
                    data[keys] = this.state.filterOptionData[keys];
                }

            }
        }

        if (Object.keys(data).length > 0) {
            this.props.onHeaderFilterChange(data);
        }
    }


    getDataBasedOnFilters = () => {
        let data = {
            buyerid: this.state.buyerid["value"] || "",
            brokerid: this.state.brokerid["value"] || "",
            supplierid: this.state.supplierid["value"] || "",
        }
        if (data["buyerid"] === "") {
            delete data["buyerid"];
        }
        if (data["brokerid"] === "") {
            delete data["brokerid"];
        }
        if (data["supplierid"] === "") {
            delete data["supplierid"];
        }
        if (this.state.filterOptionData["supporting_images"] === "All") {
            delete this.state.filterOptionData["supporting_images"];
        }
        
        var uData = { ...data, ...this.state.filterOptionData }

        this.props.getSearchedOrderListData(uData);
    }


    getSearchAreaText = (id, event) => {
        try {
            this.setState({ [id]: event !== null ? event : "" });
        } catch (err) {
            console.log(err);
        }
    }

    getOptions = async (type, inputValue, callback) => {
        try {
            if (!inputValue) {
                callback([]);
            }
            let resp = {};
            let data = {};
            data["searchVal"] = inputValue;
            if (type === "buyerid") {

                data['role'] = 'ca';
                resp = await buyerService.serchUser(data);
            }
            if (type === "brokerid") {
                data['role'] = 'broker';
                resp = await brokerService.serchUser(data);
            }
            if (type === "supplierid") {
                data['role'] = 'la';
                resp = await supplierService.serchUser(data);
            }

            if (resp.data.status === 1 && resp.data.result) {
                var respData = [];
                if (type === "brokerid") {
                    respData = this.formatDataForDropDown(resp.data.result.data, "fullname", "id");
                } else {
                    respData = this.formatDataForDropDown(resp.data.result.data, "fullname", "mobile");
                }

                callback(respData);
            } else {
                callback([]);
            }
        } catch (err) {
            console.error(err);
            callback([]);
        }
    }

    formatDataForDropDown(data, labelKey, valuekey) {

        var optionsData = [];
        if (data) {
            for (var i = 0; i < data.length; i++) {
                optionsData.push({ label: data[i][labelKey], value: data[i][valuekey] });
            }
        }
        return optionsData;
    }


    onFilterDataAdded(data) {
        // console.log(data);
        this.setState({ filterOptionData: data, isFilterDialogOpen: false, open: false })
    }

    onFilterClick(event) {
        this.setState({ isFilterDialogOpen: true, open: true });
    }

    onFilterClose(event) {
        this.setState({ isFilterDialogOpen: false, open: false });
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Grid container direction="row" alignItems="stretch">
                    <Grid item xs={12} sm={12} md={12}>

                        {this.state.configData &&
                            <form className={classes.root} autoComplete="off" style={{ padding: '15px 0px', backgroundColor: "#fff", color: "#000", borderRadius: "4px" }}>
                                {this.state.configData.map((obj, index) => (
                                    <React.Fragment key={index}>
                                        {(obj && obj.name && obj.id) &&
                                            <FormControl variant="outlined" className={classes.formControl}
                                            style={{ flex: 1 ,zIndex:"999"}}>
                                                <AsyncSelect
                                                    cacheOptions
                                                    value={this.state[obj.name]}
                                                    name={obj.name}
                                                    onChange={this.getSearchAreaText.bind(this, obj.id)}
                                                    isSearchable={true}
                                                    isClearable={true}
                                                    placeholder={`Select ${obj.name}`}
                                                    defaultOptions={obj.options}
                                                    loadOptions={this.getOptions.bind(this, obj.id)}
                                                />
                                            </FormControl>
                                        }
                                    </React.Fragment>
                                ))}
                                <div><Badge className={classes.margin} style={{ height: '50px' }} badgeContent={Object.keys(this.state.filterOptionData).length} color="primary">
                                    <Button component="span" style={{ padding: '5px 10px', fontSize: 12, color: '#b1b1b1', margin: '0px 5px' }} onClick={this.onFilterClick.bind(this)}>
                                        Filter
                                </Button>
                                </Badge></div>

                                {this.state.isFilterDialogOpen && <UserFilterOption
                                    openModal={this.state.open}
                                    role={this.props.role}
                                    filterData={this.state.filterOptionData}
                                    onEditModalCancel={this.onFilterClose.bind(this)}
                                    onFilterAdded={this.onFilterDataAdded.bind(this)} />}

                                <Button component="span" style={{ border: '1px solid #e72e89', padding: '5px 10px', fontSize: 12, backgroundColor: '#e72e89', color: '#fff', margin: '0px 10px' }}
                                    onClick={this.getDataBasedOnFilters.bind(this)}>
                                    Search
                                </Button>
                            </form>
                        }

                    </Grid>
                </Grid>
            </div >
        );
    }
}

FilterAreaComponent.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FilterAreaComponent);
