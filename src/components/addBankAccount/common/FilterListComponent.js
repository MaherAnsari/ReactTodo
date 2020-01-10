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
                //     { name: "Buyer", id: "buyerid", options: this.props.buyersList },
                //     { name: "Broker", id: "brokerid", options: this.props.brokersList },
                { name: "User", id: "supplierid", options: this.props.suppliersList }
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


    getDataBasedOnFilters = () => {
        let data = {
            // buyerid: this.state.buyerid["value"] || "",
            // brokerid: this.state.brokerid["value"] || "",
            supplierid: this.state.supplierid["value"] || "",
        }
        // if (data["buyerid"] === "") {
        //     delete data["buyerid"];
        // }
        // if (data["brokerid"] === "") {
        //     delete data["brokerid"];
        // }
        // if (data["supplierid"] === "") {
        //     delete data["supplierid"];
        // }

        // var uData = { data }
        if (this.state.supplierid["value"]) {
            this.props.getSearchedOrderListData(this.state.supplierid["value"]);
        }
    }


    getSearchAreaText = (id, event) => {
        try {
            this.setState({ [id]: event !== null ? event : "" });
            if (event === null) {
                this.props.onsearchCleared();
            }
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
                                                style={{ flex: 1, zIndex: "999" }}>
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
                                <Button component="span" style={{ border: '1px solid #e72e89', padding: '5px 10px', fontSize: 12, backgroundColor: '#e72e89', color: '#fff', margin: '0px 10px' }}
                                    onClick={this.getDataBasedOnFilters.bind(this)}>
                                    Get Account info
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
