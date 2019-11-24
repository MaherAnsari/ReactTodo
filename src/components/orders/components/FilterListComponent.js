import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button';
import ReactDOM from 'react-dom';
import FormControl from '@material-ui/core/FormControl';
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
            buyerid:[],
            brokerid:[],
            supplierid:[],
            labelWidth: 0,
            configData: [
                {name:"Buyer", id:"buyerid", options: this.props.buyersList},
                {name:"Broker", id:"brokerid", options: this.props.brokersList},
                {name:"Supplier", id:"supplierid", options : this.props.suppliersList}
            ]
        }
    }

    componentDidMount() {
        if (this.InputLabelRef) {
            this.setState({
                labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
            });
        }
    }

    componentWillReceiveProps( nextprops ){
        var data = this.state.configData;
        if(nextprops.buyersList !== data[0]["options"] || nextprops.brokersList !== data[0]["options"] || nextprops.suppliersList !== data[0]["options"]){
            data[0]["options"] = nextprops.buyersList;
            data[1]["options"] = nextprops.brokersList;
            data[2]["options"] = nextprops.suppliersList;
          this.setState({ configData :  data });
        }
      }


    getDataBasedOnFilters = () => {
        let data = {
            buyerid : this.state.buyerid["value"],
            brokerid : this.state.brokerid["value"],
            supplierid : this.state.supplierid["value"],
        }
        if ( data["buyerid"] === "" ) {
           delete data["buyerid"];
        }
        if ( data["brokerid"] === "" ) {
            delete data["brokerid"];
         }
         if ( data["supplierid"] === "" ) {
            delete data["supplierid"];
         }
        this.props.getSearchedOrderListData(data);
    }


    getSearchAreaText = (id, indexOfSelect, event) => {
        try {
            this.setState([id] : event);
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Grid container direction="row" alignItems="stretch">
                    <Grid item xs={12} sm={12} md={12}>
                        {this.state.configData &&
                            <form className={classes.root} autoComplete="off" style={{ padding: '15px 0px', backgroundColor: "#05073a", color: "#000", borderRadius: "4px" }}>
                                {this.state.configData.map((obj, index) => (
                                    <React.Fragment key={index}>
                                        {(obj && obj.name && obj.id) &&
                                            <FormControl variant="outlined" className={classes.formControl}
                                                style={{ flex: 1 }}>
                                                <Select
                                                    name={obj.name}
                                                    value={this.state[obj.name]}
                                                    onChange={this.getSearchAreaText.bind(this, obj.id, index)}
                                                    options={obj.options}
                                                    isSearchable={true}
                                                    placeholder={`Select ${obj.name}`}
                                                    className={"basic-single " + classes.bgColor} />

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
            </div >
        );
    }
}

FilterAreaComponent.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FilterAreaComponent);
