import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import { useTheme } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 300,
        // maxWidth: 300,
        width: "100%"
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
    noLabel: {
        marginTop: theme.spacing(3),
    },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const filterOptions = [
    "APMC Req",
    "Mandi Grade",
    "Mandi Grade (Hindi)"
];

const ampcReqOption = ["All", "Yes", "No"];
const mandiGradeFilterOption = ["All", "A", "B", "C", "D", "E", "F"];
const mandiGradeHindiFilterOption = ["All", 'क', 'ख', 'ग', 'घ', 'ङ', 'च'];

function getStyles(name, personName, theme) {
    return {
        fontWeight:
            theme.typography.fontWeightRegular
        // : theme.typography.fontWeightMedium,
    };
}



export default function FilterOptionData(viewProps) {
    const classes = useStyles();
    const theme = useTheme();
    const [filterOptionsVal, setFilterOptionsVal] = React.useState([]);
    const [ampcReqFilterVal, setAmpcReqFilterVal] = React.useState("");
    const [mandiGradeFilterVal, setMandiGradeFilterVal] = React.useState("");
    const [mandiGradeHindiFilterVal, setMandiGradeHindiFilterVal] = React.useState("");

    const [filterPayloadObj, setFilterPayloadObj] = React.useState({});

    const handleChange = event => {
        setFilterOptionsVal(event.target.value);
    };

    const handleChangeOfAmpcReqFilterVal = event => {
        setAmpcReqFilterVal(event.target.value);
    };

    const handleChangeOfMandiGrade = event => {
        setMandiGradeFilterVal(event.target.value);
    };

    const handleChangeOfMandiGradeHindi = event => {
        setMandiGradeHindiFilterVal(event.target.value);
    };

    const handleChangeOffilterPayloadObj = data => {
        setFilterPayloadObj(data);
    };

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handelFilterChosen = () => {
        var filterPayload = {}

        if (ampcReqFilterVal !== "" && ampcReqFilterVal !== "All") {
            filterPayload["apmc_req"] = ampcReqFilterVal === "Yes" ? true : false;
        }
        if (mandiGradeFilterVal !== "" && mandiGradeFilterVal !== "All") {
            filterPayload["mandi_grade"] = mandiGradeFilterVal.toString();
        }

        if (mandiGradeHindiFilterVal !== "" && mandiGradeHindiFilterVal !== "All") {
            filterPayload["mandi_grade_hindi"] = mandiGradeHindiFilterVal.toString();
        }
        handleChangeOffilterPayloadObj(filterPayload);
        viewProps.onFilterAdded(filterPayload);
        setOpen(false);
    };



    return (
        <div>
            <Badge className={classes.margin} badgeContent={Object.keys(filterPayloadObj).length} color="primary">
                <Button onClick={handleClickOpen} style={{ lineHeight: "36px" }}>Filter</Button>
            </Badge>
            <Dialog disableBackdropClick disableEscapeKeyDown open={open} onClose={handleClose}>
                <DialogTitle>Select Filter</DialogTitle>
                <DialogContent>
                    <form className={classes.container}>
                        <FormControl className={classes.formControl}>
                            <InputLabel id="demo-mutiple-chip-label">Select ampc_req</InputLabel>
                            {/* <Select
                                labelId="demo-mutiple-chip-label1"
                                id="demo-mutiple-chip"
                                multiple
                                fullWidth
                                value={filterOptionsVal}
                                onChange={handleChange}
                                input={<Input id="select-multiple-chip" />}
                                renderValue={selected => (
                                    <div className={classes.chips}>
                                        {selected.map(value => (
                                            <Chip key={value} label={value} className={classes.chip} />
                                        ))}
                                    </div>
                                )}
                                MenuProps={MenuProps}
                            >
                                {filterOptions.map(name => (
                                    <MenuItem key={name} value={name} style={getStyles(name, filterOptionsVal, theme)}>
                                        {name}
                                    </MenuItem>
                                ))}
                            </Select> */}
                            <Select
                                labelId="demo-customized-select-label"
                                id="demo-customized-select"
                                value={ampcReqFilterVal}
                                onChange={handleChangeOfAmpcReqFilterVal}
                            // input={<BootstrapInput />}
                            >
                                {ampcReqOption.map(name => (
                                    <MenuItem value={name}>{name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl className={classes.formControl}>
                            <InputLabel id="demo-mutiple-chip-label">Select Mandi Grades</InputLabel>
                            {/* <Select
                                labelId="demo-mutiple-chip-label"
                                id="demo-mutiple-chip1"
                                // multiple
                                value={mandiGradeFilterVal}
                                onChange={handleChangeOfMandiGrade}
                                input={<Input id="select-multiple-chip" />}
                                renderValue={selected => (
                                    <div className={classes.chips}>
                                        {selected.map(value => (
                                            <Chip key={value} label={value} className={classes.chip} />
                                        ))}
                                    </div>
                                )}
                                MenuProps={MenuProps}
                            >
                                {mandiGradeFilterOption.map(name => (
                                    <MenuItem key={name} value={name} style={getStyles(name, mandiGradeFilterVal, theme)}>
                                        {name}
                                    </MenuItem>
                                ))}
                            </Select> */}
                            <Select
                                labelId="demo-customized-select-label"
                                id="demo-customized-select"
                                value={mandiGradeFilterVal}
                                onChange={handleChangeOfMandiGrade}
                            // input={<BootstrapInput />}
                            >
                                {mandiGradeFilterOption.map(name => (
                                    <MenuItem value={name}>{name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <InputLabel id="demo-mutiple-chip-label">Select Mandi Grades ( Hindi )</InputLabel>
                            {/* <Select
                                labelId="demo-mutiple-chip-label"
                                id="demo-mutiple-chip2"
                                // multiple
                                value={mandiGradeHindiFilterVal}
                                onChange={handleChangeOfMandiGradeHindi}
                                input={<Input id="select-multiple-chip" />}
                                renderValue={selected => (
                                    <div className={classes.chips}>
                                        {selected.map(value => (
                                            <Chip key={value} label={value} className={classes.chip} />
                                        ))}
                                    </div>
                                )}
                                MenuProps={MenuProps}
                            >
                                {mandiGradeHindiFilterOption.map(name => (
                                    <MenuItem key={name} value={name} style={getStyles(name, handleChangeOfMandiGrade, theme)}>
                                        {name}
                                    </MenuItem>
                                ))}
                            </Select> */}
                            <Select
                                labelId="demo-customized-select-label"
                                id="demo-customized-select2"
                                value={mandiGradeHindiFilterVal}
                                onChange={handleChangeOfMandiGradeHindi}
                            // input={<BootstrapInput />}
                            >
                                {mandiGradeHindiFilterOption.map(name => (
                                    <MenuItem value={name}>{name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
          </Button>
                    <Button onClick={handelFilterChosen} color="primary">
                        Ok
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}