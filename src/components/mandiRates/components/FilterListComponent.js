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
            stateid:[],
            districtid:[],
            commodityid:[],
            labelWidth: 0,
            configData: [
                {name:"State", id:"stateid", options: this.props.stateList},
                {name:"District", id:"districtid", options: this.props.districtList},
                {name:"Commodity", id:"commodityid", options : this.props.commodityList}
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
        if(nextprops.stateList !== data[0]["options"] || nextprops.districtList !== data[0]["options"] || nextprops.commodityList !== data[0]["options"]){
            data[0]["options"] = nextprops.stateList;
            data[1]["options"] = nextprops.districtList;
            data[2]["options"] = nextprops.commodityList;
          this.setState({ configData :  data });
        }
      }


    getDataBasedOnFilters = () => {
        let data = {
            stateid : this.state.stateid["value"],
            districtid : this.state.districtid["value"],
            commodityid : this.state.commodityid["value"],
        }
        if ( data["stateid"] === "" ) {
           delete data["stateid"];
        }
        if ( data["districtid"] === "" ) {
            delete data["districtid"];
         }
         if ( data["commodityid"] === "" ) {
            delete data["commodityid"];
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
                            <form className={classes.root} autoComplete="off" style={{ padding: '15px 0px', color: "#000", borderRadius: "4px" }}>
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
