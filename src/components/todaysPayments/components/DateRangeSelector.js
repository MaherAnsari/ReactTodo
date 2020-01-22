import 'date-fns';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

class DateRangeSelector extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedStartDate: new Date()
        }
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
    }

    componentDidMount() {
        this.props.onDateChanged({ "startDate": this.formateDateForApi(this.state.selectedStartDate) });
    }


    handleStartDateChange = (date) => {
        this.setState({ selectedStartDate: date }, function () {
            this.props.onDateChanged({ "startDate": this.formateDateForApi(date)});
        })
    }


    formateDateForApi(data) {
        if (data && data !== "") {
            var dateVal = new Date(data);
            // console.log(dateVal.getMonth());
            dateVal = dateVal.getFullYear() + "-" + ((dateVal.getMonth() + 1) < 10 ? "0" +( dateVal.getMonth() + 1) : dateVal.getMonth() + 1) + "-" + (dateVal.getDate() < 10 ? "0" + dateVal.getDate() : dateVal.getDate());
            // console.log(dateVal);
            return dateVal;
        } else {
            return "";
        }
    }

    render() {
        const { selectedStartDate, selectedEndDate } = this.state;
        return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container justify="flex-end">

                    <div style={{
                        verticalAlign: "middle",
                        lineHeight: "52px",
                        fontSize: "16px",
                        fontFamily: "lato",
                        fontWeight: 500,
                        marginRight:'30px' 
                    }}>Select Date &nbsp; &nbsp;&nbsp;</div>
               
                    <KeyboardDatePicker
                        margin="normal"
                        id="date-picker-dialog"
                        label="Select date"
                        format="dd-MMM-yyyy"
                        style={{ marginTop: 0, width: 150,marginRight:'30px' }}
                        value={selectedStartDate}
                        onChange={this.handleStartDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }} />
                   
                </Grid>
            </MuiPickersUtilsProvider>);
    }
}


export default (DateRangeSelector);