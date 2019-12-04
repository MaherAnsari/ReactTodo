import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button';
import ReactDOM from 'react-dom';
import FormControl from '@material-ui/core/FormControl';
import Select from 'react-select';
import mandiDataService from '../../app/mandiDataService/mandiDataService';

// import FilterOptionData from "./FilterOptionData";


const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        // margin: '0px 5px',
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
            fontWeight: "500",
            fontFamily: "lato",
            fontSize: "14px",
            color: "#3e5569",
        }
    },
    searchInput: {
        borderColor: "hsl(0,0%,80%)",
        borderRadius: "4px",
        borderStyle: "solid",
        borderWidth: "1px",
        width: "100%",
        height: "50px",
        padding: "10px",
        margin: "0px 0px !important",
        fontWeight: "500",
        fontFamily: "lato",
        fontSize: "14px",
        color: "#3e5569"

    }
});

class UserFilterDataView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            stateid: [],
            districtid: [],
            labelWidth: 0,
            districtData:[],
            configData: [
                { name: "State", id: "stateid", options: this.props.stateList },
                { name: "District", id: "districtid", options: [] },
                { name: "Search", id: "searchInput", options: {} }
            ],
            searchedTxt: "",
            filterOptionData: {}
        }
    }


    componentDidMount() {
        this.getDistrictData();
        if (this.InputLabelRef) {
            this.setState({
                labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
            });
        }
    }

    componentWillReceiveProps(nextprops) {
        var data = this.state.configData;
        if (nextprops.stateList !== data[0]["options"]) {
            data[0]["options"] = nextprops.stateList;
            this.setState({ configData: data });
        }
    }

    async getDistrictData() {
        let resp = await mandiDataService.getDistrictList();
        if (resp.data.status === 1 && resp.data.result) {
            this.setState({ districtData: resp.data.result.data });
        }



    }


    getDataBasedOnFilters = () => {
        let data = {
            state: this.state.stateid["value"],
            district: this.state.districtid["value"],
            searchVal: this.state.searchedTxt
        }
        if (data["state"] === "") {
            delete data["state"];
        }
        if (data["district"] === "") {
            delete data["district"];
        }
        if (data["searchVal"] === "") {
            delete data["searchVal"];
        }

        if (Object.keys(this.state.filterOptionData).length > 0) {
            for (var keys in this.state.filterOptionData) {
                data[keys] = this.state.filterOptionData[keys];
            }
        }

        if (Object.keys(data).length > 0) {
            this.props.onHeaderFilterChange(data);
        }
    }

    handelSearchInputChange = (event) => {
        this.setState({ searchedTxt: event.target.value || "a" })
        console.log(event.target.value);
    }


    formatDistrictData(value) {
        let data = this.state.districtData[value];
        var optionsData = [];

        for (var i = 0; i < data.length; i++) {
            optionsData.push({ label: data[i]['district_name'], value: data[i]['district_name'] });
        }

        var dataObj = this.state.configData;
        dataObj[1]["options"] = optionsData;
        this.setState({ configData: dataObj });
    }

    getSearchAreaText = (id, event) => {
        try {
            this.setState({ [id]: event !== null ? event : "" });
            if (id === 'stateid' && event) {
                this.formatDistrictData(event.value);
            }
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        const { classes } = this.props;
        return (

            <Grid container direction="row" alignItems="stretch">
                <Grid item xs={12} sm={12} md={12}>
                    {this.state.configData &&
                        <form className={classes.root} autoComplete="off" style={{ padding: '15px 0px', color: "#000", borderRadius: "4px" }}>
                            {this.state.configData.map((obj, index) => (
                                <React.Fragment key={index}>
                                    {(obj && obj.name && obj.id && obj.id !== "searchInput") ?
                                        <FormControl variant="outlined" className={classes.formControl}
                                            style={{ flex: 1 }}>
                                            <Select
                                                name={obj.name}
                                                value={this.state[obj.name]}
                                                onChange={this.getSearchAreaText.bind(this, obj.id)}
                                                options={obj.options}
                                                isSearchable={true}
                                                isClearable={true}
                                                placeholder={`Select ${obj.name}`}
                                                className={"basic-single " + classes.bgColor} />

                                        </FormControl> :
                                        <FormControl variant="outlined" className={classes.formControl}
                                            style={{ flex: 1 }}>
                                            <div style={{ width: '98%', display: "flex" }}>
                                                <input
                                                    type="text"
                                                    id="searchinput"
                                                    placeholder="Search..."
                                                    className={classes.searchInput}
                                                    onChange={this.handelSearchInputChange.bind(this)}
                                                />
                                            </div>
                                        </FormControl>
                                    }
                                </React.Fragment>
                            ))}
                            <Button component="span" style={{ border: '1px solid #e72e89', padding: '5px 10px', fontSize: 12, backgroundColor: '#e72e89', color: '#fff', margin: '0px 10px' }} onClick={this.getDataBasedOnFilters.bind(this)}>
                                Search
                                </Button>
                        </form>
                    }

                </Grid>
            </Grid>

        );
    }
}

UserFilterDataView.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(UserFilterDataView);
