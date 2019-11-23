import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const styles = theme => ({})
const ITEM_HEIGHT = 48;

class OptionList extends React.Component {
  
    state = {
        anchorEl: null, 
        setAnchorEl:null,
        open:false,
        options : [
            "Edit User","Disable User","Add Account"
          ]
    };
   componentWillMount(){
       console.log(this.props);
    //    this.setState({open:this.props.show})
   }
    componentWillReceiveProps() {
       
    }
  handleClick = event => {
      console.log(event);
      this.setState({open:true,setAnchorEl: event.currentTarget})
   
  };

 

   handleClose = (event) => {
       console.log(event.currentTarget);
    this.setState({setAnchorEl: null,open:false});
  };

  render() {
    // const { classes } = this.props;
  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={this.handleClick.bind(this)}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={this.state.anchorEl}
        keepMounted
        open={this.state.open}
        style={{marginLeft:'80%'}} 
        onClose={this.handleClose.bind(this)}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: 200,
            float:'right'
          },
        }}
      >
        {this.state.options.map(option => (
          <MenuItem key={option}  onClick={this.handleClose.bind(this)}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
}

OptionList.propTypes = {
    //   fullScreen: PropTypes.bool.isRequired,
    classes: PropTypes.object,
};

export default ( withStyles(styles))(OptionList);

