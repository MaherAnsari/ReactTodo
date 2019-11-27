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
            selectedStartDate: this.getPreviousDate(15),
            selectedEndDate: new Date()
        }
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
    }

    componentDidMount() {
        this.props.onDateChanged({ "startDate": this.formateDateForApi(this.state.selectedStartDate), "endDate": this.formateDateForApi(this.state.selectedEndDate) });
    }

    getPreviousDate(PreviousnoOfDays) {
        var date = new Date();
        return (new Date(date.setDate(date.getDate() - PreviousnoOfDays)));
    }

    handleStartDateChange = (date) => {
        this.setState({ selectedStartDate: date }, function () {
            this.props.onDateChanged({ "startDate": this.formateDateForApi(date), "endDate": this.formateDateForApi(this.state.selectedEndDate) });
        })
    }
    handleEndDateChange = (date) => {
        this.setState({ selectedEndDate: date }, function () {
            this.props.onDateChanged({ "startDate": this.formateDateForApi(this.state.selectedStartDate), "endDate": this.formateDateForApi(date) });
        })
    }

    formateDateForApi(data) {
        if (data && data !== "") {
            var dateVal = new Date(data);
            dateVal = dateVal.getFullYear() + "-" + (dateVal.getMonth() + 1 < 10 ? "0" + dateVal.getMonth() + 1 : dateVal.getMonth() + 1) + "-" + (dateVal.getDate() < 10 ? "0" + dateVal.getDate() : dateVal.getDate());
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
                        marginRight:'30px'
                    }}>Select Date Range &nbsp; &nbsp;&nbsp;</div>
                    {/* <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="yyyy/MM/dd"
          margin="normal"
          id="date-picker-inline"
          label="Start date"
          style={{marginTop: 0}}
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        /> */}
                    <KeyboardDatePicker
                        margin="normal"
                        id="date-picker-dialog"
                        label="Start date"
                        format="dd/MM/yyyy"
                        style={{ marginTop: 0, width: 150 ,marginRight:'30px'}}
                        value={selectedStartDate}
                        onChange={this.handleStartDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }} />
                        &nbsp;&nbsp;&nbsp;
                    <KeyboardDatePicker
                        margin="normal"
                        id="date-picker-dialog"
                        label="End date"
                        format="dd/MM/yyyy"
                        style={{ marginTop: 0, width: 150 ,marginRight:'100px'}}
                        value={selectedEndDate}
                        onChange={this.handleEndDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                </Grid>
            </MuiPickersUtilsProvider>);
    }
}


export default (DateRangeSelector);