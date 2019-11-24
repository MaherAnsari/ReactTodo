import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button';
import ReactDOM from 'react-dom';
import FormControl from '@material-ui/core/FormControl';
import { FormattedMessage } from 'react-intl';

import Select from 'react-select';


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
            display: "inline-block",
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
            Specialities: '',
            Region: '',
            City: '',
            name: '',
            Center: '',
            Channel: '',
            Zone: '',
            labelWidth: 0,
            npsDashboardConfig: this.props.npsDashboardConfig,
            clearFilterData: this.props.clearFilterData
        }
    }

    componentDidMount() {
        if (this.InputLabelRef) {
            this.setState({
                labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
            });
        }
        // this.checkForDefaultValue();
    }

    checkForDefaultValue() {
        if (this.state.npsDashboardConfig && this.state.npsDashboardConfig.length > 0) {
            for (var i = 0; i < this.state.npsDashboardConfig.length; i++) {
                if (this.state.npsDashboardConfig[i].hasOwnProperty("defaultValue") &&
                    this.state.npsDashboardConfig[i]["defaultValue"] &&
                    this.state.npsDashboardConfig[i]["defaultValue"] !== "") {

                    if (this.state.npsDashboardConfig[i]["name"] === "Zone" &&
                        this.state.npsDashboardConfig[i].hasOwnProperty("dependingFilter") &&
                        this.state.npsDashboardConfig[i]["dependingFilter"] === "center") {
                        if (this.state.npsDashboardConfig[1]["name"] === "Center") {
                            this.state.npsDashboardConfig[1]["options"] = this.state.npsDashboardConfig[i]["mappingDic"][this.state.npsDashboardConfig[i]["defaultValue"]]
                        }
                    }
                    this.setState({
                        [this.state.npsDashboardConfig[i]["name"]]: {
                            label: this.state.npsDashboardConfig[i]["defaultValue"],
                            value: this.state.npsDashboardConfig[i]["defaultValue"]
                        }
                    });

                }
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.clearFilterData !== nextProps.clearFilterData) {
            this.state.clearFilterData = nextProps.clearFilterData;
            this.setState(this.state);
            if (this.state.clearFilterData) {
                this.clearFilterValues();
            }
        }
    }

    clearFilterValues() {
        this.setState({
            Center: '',
            Channel: '',
            Zone: ''
        });
    }

    // handleChange = event => {
    //     try {
    //         this.setState({ [event.target.name]: event.target.value });
    //         console.log(this.state.npsDashboardConfig)
    //         var npsDashboardConfig = this.state.npsDashboardConfig;
    //         if ((event.target.value === "ml" || event.target.value === "mhc") && this.state.npsDashboardConfig && this.state.npsDashboardConfig[0].hasOwnProperty("mappingDic")) {
    //             npsDashboardConfig[1]["options"] = this.state.npsDashboardConfig[0]["mappingDic"][event.target.value];
    //             this.setState({ npsDashboardConfig: npsDashboardConfig });
    //         }
    //     } catch (err) {
    //         console.log(err);
    //     }
    //     // console.log(npsDashboardConfig )

    // };

    getDataBasedOnFilters = () => {
        let data = {
            Center: this.state.Center["value"],
            Channel: this.state.Channel["value"],
            Zone: this.state.Zone["value"],
        }
        if (data["Zone"] && data["Zone"] !== "" && !data["Center"]) {
            data["Center"] = this.getCenterIds();
        }
        this.props.emitFilterData(data);
    }

    getCenterIds() {
        try {
            var cednterids = [];
            for (var i = 0; i < this.state.npsDashboardConfig[1]["options"].length; i++) {
                cednterids.push(this.state.npsDashboardConfig[1]["options"][i]["value"]);
            }
            return cednterids.toString();
        } catch (err) {
            console.log(err);
            return "";
        }
    }

    getSearchAreaText = (id, indexOfSelect, event) => {
        try {
            this.state[id] = event;
            this.setState(this.state);
            var npsDashboardConfig = this.state.npsDashboardConfig;
            if (id === "Zone" &&   // id selected as Zone because it depends only on Zone
                this.state.npsDashboardConfig &&
                this.state.npsDashboardConfig[indexOfSelect].hasOwnProperty("dependingFilter") &&
                this.state.npsDashboardConfig[indexOfSelect]["dependingFilter"] === "center" &&
                this.state.npsDashboardConfig[indexOfSelect].hasOwnProperty("mappingDic")) {
                npsDashboardConfig[1]["options"] = this.state.npsDashboardConfig[indexOfSelect]["mappingDic"][event.value];
                this.setState({ npsDashboardConfig: npsDashboardConfig });
            }

        } catch (err) {
            console.log(err);
        }
    }

    render() {
        const { classes } = this.props;
        const { cardColor, textColor } = this.props.themeData;
        return (
            <div>
                <Grid container direction="row" alignItems="stretch">
                    <Grid item xs={12} sm={12} md={12}>
                        {this.state.npsDashboardConfig &&
                            // <Card style={{ backgroundColor: cardColor, color: textColor }}>
                            <form className={classes.root} autoComplete="off" style={{ padding: '15px 0px', backgroundColor: cardColor, color: textColor, borderRadius: "4px" }}>
                                {this.state.npsDashboardConfig.map((indFilter, index) => (
                                    <React.Fragment key={index}>
                                        {(indFilter && indFilter.name && indFilter.type) &&
                                            (!indFilter.hasOwnProperty("hide") ||
                                                (indFilter.hasOwnProperty("hide") && !indFilter["hide"])) &&
                                            <FormControl variant="outlined" className={classes.formControl}
                                                style={{ flex: 1 }}>
                                                <Select
                                                    name={indFilter.name}
                                                    value={this.state[indFilter.name]}
                                                    onChange={this.getSearchAreaText.bind(this, indFilter.name, index)}
                                                    options={indFilter.options}
                                                    isSearchable={true}
                                                    placeholder={`Select ${indFilter.name}`}
                                                    className={"basic-single " + classes.bgColor} />

                                            </FormControl>
                                        }
                                    </React.Fragment>
                                ))}
                                <Button component="span" style={{ border: '1px solid #537cf7', padding: '5px 10px', fontSize: 12, backgroundColor: '#537cf7', color: 'white', margin: '0px 10px' }} onClick={this.getDataBasedOnFilters.bind(this)}>
                                    <FormattedMessage id="Get_Data" />
                                </Button>
                            </form>
                            // </Card>
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
