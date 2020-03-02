// import { FontIcon } from 'material-ui' // BETTER SOLUTION ;)
import React from 'react';
import './sidebarCss.css';
import { withRouter } from 'react-router-dom';
import { Icon } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import { getStatusOfRole } from '../config/appConfig';
import bijakLogo from "../assets/images/bijak_logo_new.png";

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    backgroundColor: 'blue',
  },
  listItemIconOpen: {
    color: '#1991eb',
  },

});


const _items = [
  {
    name: 'User Data', id: "2", route: '', roletabName: "BasicUser", iconClassName: 'supervised_user_circle', iconColor: "#477de3", children: [
      { name: 'All', route: '/user-list', iconClassName: 'supervised_user_circle', iconColor: "#4da443" },
      { name: 'Broker', route: '/broker-list', iconClassName: 'local_mall', iconColor: "#f9e646" },
      { name: 'CA Data (Buyer)', route: '/buyer-list', iconClassName: 'shopping_cart', iconColor: "#4980ea" },
      { name: 'LA Data (Supplier)', route: '/supplier-list', iconClassName: 'local_shipping', iconColor: "#ed9649" },
      { name: "Add Bank Account", route: '/add-bank-account', iconClassName: 'account_balance', iconColor: "#bde347" },
    ]
  },
  {
    name: 'Business Data', id: "3", roletabName: "BasicUser", route: '', iconClassName: 'local_atm', iconColor: "#62cc42", children: [
      { name: 'Rate List', route: '/rate-list', iconClassName: 'local_atm', iconColor: "#ed9649" },
      { name: 'Orders', route: '/orders-list', iconClassName: 'view_list', iconColor: "#e6343a" },
      { name: 'Payments', route: '/payment', iconClassName: 'payment', iconColor: "#62cc42" },
      { name: "Day-wise Payments", route: '/todays-payment', iconClassName: 'account_tree', iconColor: "#477de3" },
      { name: 'Payments Detail', route: '/payment-details', iconClassName: 'payment', iconColor: "#4980ea" },
      { name: 'Download Data', route: '/downlaod-net', iconClassName: 'cloud_download', iconColor: "#62cc42" },
    ]
  },
  {
    name: 'Supporting Data', roletabName: "SupportingDataManagement", id: "1", route: '/', iconClassName: 'work_outline', iconColor: "#5cb8eb", children: [
      { name: 'Mandi Data', route: '/mandi-data', iconClassName: 'work_outline', iconColor: "#4da443" },
      { name: 'Mandi Rates', route: '/mandi-rates', iconClassName: 'library_books', iconColor: "#f9e646" },
      { name: 'Commodity List', route: '/comodity-list', iconClassName: 'eco', iconColor: "#50a1cf" },
    ]
  },
  {
    name: 'Permissions', id: "4", route: '/', roletabName: "permissions", iconClassName: 'supervised_user_circle', iconColor: "#ed9649", children: [
      { name: "Role-Permission", route: '/role-permission', iconClassName: 'supervised_user_circle', iconColor: "#bde347" },
    ]
  },
  // { name: 'Mandi Rates', route: '/mandi-rates', iconClassName: 'library_books', iconColor: "#f9e646", children: [] },

  // { name: 'Broker Data',  route: '/broker-list', iconClassName: 'local_mall', iconColor: "#e6008a", children: [] },
  // { name: 'Buyer Data', route: '/buyer-list', iconClassName: 'shopping_cart', iconColor: "#e6008a", children: [] },
  // { name: 'Supplier Data', route: '/supplier-list', iconClassName: 'local_shipping', iconColor: "#e6008a", children: [] },

  // { name: 'Commodity List', route: '/comodity-list', iconClassName: 'eco', iconColor: "#50a1cf", children: [] },
  // { name: 'Orders', route: '/orders-list', iconClassName: 'view_list', iconColor: "#e6343a", children: [] },
  // { name: 'Payments', route: '/payment', iconClassName: 'payment', iconColor: "#62cc42", children: [] }

]


class VerticalItem extends React.Component {


  componentDidMount() {

    // to open default sub item selected
    var routeItem = this.props.item;
    if (routeItem.children.length > 0) {
      for (var j = 0; j < routeItem.children.length; j++) {
        if (routeItem.children[j]["route"] === this.props.active) {
          // this.setState({ isHover : true }, function(){
          this.props.onAccordClicked(routeItem["id"])
          this.props.onRouteClicked(routeItem.children[j]["name"]);
          // });
          break;
        }
      }
    }
  }


  toggleHover(accord) {

    // if(this.props.activeAccordian === accord ){
    this.props.onAccordClicked(accord)
    // }else{
    //   this.props.onAccordClicked( accord)
    // }

  }

  onSelect(data) {

    this.props.onSelect(data.route);
    this.props.onRouteClicked(data.name);
    // this.toggleHover(true);


  }


  getSubList(i, active, isdrawerOpen) {
    return (
      <li className="class_li" key={i.route}
        data-toggle={!isdrawerOpen ? "tooltip" : ""} title={!isdrawerOpen ? i.name : ""}
        style={{ background: active === i.route ? "#05073a" : "", borderLeft: active === i.route ? '4px solid #5cb8eb' : '#25283b', color: i.iconColor }}
        onClick={() => this.onSelect(i)} >

        <Icon className="sideBarIcon" style={{ fontSize: "18px" }}>
          {i.iconClassName}
        </Icon>
        <div className='item-name' >{i.name}</div>
        {active === i.route ? <i className={"fa fa-chevron-right"}
          style={{ position: "absolute", right: "0px", color: "#afb1b9" }} aria-hidden="true"></i> : ""}
      </li>
    );
  }

  renderSubLevel(item) {
    const { active, isdrawerOpen } = this.props

    return (
      <ul className='class_ul sub-level' >
        {item.children && item.children.map(i => {
          return (
            (i.route === "/downlaod-net" ? (getStatusOfRole("DownloadData") ?
              this.getSubList(i, active, isdrawerOpen) : "" ) : this.getSubList(i, active, isdrawerOpen))
          )
        })}
      </ul>
    )
  }

  render() {
    const { item, active, activeAccordian, isdrawerOpen } = this.props
    let className = 'vertical-item-component';
    if (activeAccordian === item["id"]) className += ' is-hover'
    return (
      (getStatusOfRole(item.roletabName) &&
        <li
          ref={ref => { this._ref = ref }}
          style={{ background: active === item.route ? '#5cb8eb' : '#25283b' }}
          className={className + " class_li"}>
          <div>
            <div className='item' data-toggle={!isdrawerOpen ? "tooltip" : ""} title={!isdrawerOpen ? item.name + "" : ""}
              style={{ background: active === item.route ? '#25283b' : '#2e3247' }}
              onClick={() => {
                if (item.children.length === 0) {
                  this.onSelect(item)
                } else {
                  this.toggleHover(activeAccordian !== item.id ? item.id : "")
                }
              }
              }  >
              <Icon className="sideBarIcon" style={{ color: item.iconColor, fontSize: "18px" }}>
                {item.iconClassName}
              </Icon>
              <div className='item-name'>{item.name}</div>
              {isdrawerOpen && <i className={activeAccordian === item["id"] ? "fa fa-chevron-up" : "fa fa-chevron-down"}
                style={{ position: "absolute", right: "0px", color: "#afb1b9" }} aria-hidden="true"></i>}
            </div>
            {this.renderSubLevel(item)}
          </div>
        </li>
        // : (sessionStorage.getItem("userRole") &&
        // sessionStorage.getItem("userRole").indexOf("super-admin") > -1 &&
        // <li
        //   ref={ref => { this._ref = ref }}
        //   style={{ background: active === item.route ? '#5cb8eb' : '#25283b' }}
        //   className={className + " class_li"}>
        //   <div>
        //     <div className='item' data-toggle={!isdrawerOpen ? "tooltip" : ""} title={!isdrawerOpen ? item.name + "" : ""}
        //       style={{ background: active === item.route ? '#25283b' : '#2e3247' }}
        //       onClick={() => {
        //         if (item.children.length === 0) {
        //           this.onSelect(item)
        //         } else {
        //           this.toggleHover(activeAccordian !== item.id ? item.id : "")
        //         }
        //       }
        //       }  >
        //       <Icon className="sideBarIcon" style={{ color: item.iconColor, fontSize: "18px" }}>
        //         {item.iconClassName}
        //       </Icon>
        //       <div className='item-name'>{item.name}</div>
        //       {isdrawerOpen && <i className={activeAccordian === item["id"] ? "fa fa-chevron-up" : "fa fa-chevron-down"}
        //         style={{ position: "absolute", right: "0px", color: "#afb1b9" }} aria-hidden="true"></i>}
        //     </div>
        //     {this.renderSubLevel(item)}
        //   </div>
        // </li>)
      )
    )

  }
}
VerticalItem.defaultProps = {
  item: {},
  extended: false,
  active: false,
}

class VerticalNavigation extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      activeAccordian: "",
    }
  }

  onRouteChanged(route) {
    this.props.onChange(route);
  }

  render() {
    const { items, open, activeRoute, dbImageUrl, isdrawerOpen } = this.props;
    let additionalClass = ''
    additionalClass += open ? 'extended' : 'collapsed'
    return (
      <div className={`vertical-navigation-component ${additionalClass}`}>
        <div className='nav-header' style={{ backgroundColor: '#2e3247' }}>
          <div>
            <img style={{
              height: '60px',
              maxWidth: '200px',
              padding: '10px 10px 10px 10px'
            }}
              src={bijakLogo}
              // src={'https://static.wixstatic.com/media/3ae3ef_e4ffe8f5fc524099b6a01ad4652b5bed~mv2.png/v1/fill/w_153,h_46,al_c,q_80,usm_1.20_1.00_0.01/Bijak%20Agritech%20Logo.webp'}
              alt={dbImageUrl} />
          </div>
          {/* <Tooltip title={labname || ""} placement="right" >
            <div style={{
              textAlign: 'center',
              fontWeight: 700,
              fontSize: '20px',
              fontFamily: 'lato',
              width: '100%',
              textOverflow: 'ellipsis',
              overflow: 'hidden'
            }} >{'Bijak'}</div>
          </Tooltip> */}


        </div>
        <ul className="class_ul"  >
          {items.map((i, index) => (
            <VerticalItem
              key={`vni_${index}`}
              item={i}
              index={index}
              extended={open}
              active={activeRoute}
              isdrawerOpen={isdrawerOpen}
              activeAccordian={this.state.activeAccordian}
              onAccordClicked={(data) => this.setState({ activeAccordian: data })}
              onRouteClicked={(rname) => this.props.onRouteClicked(rname)}
              onSelect={this.onRouteChanged.bind(this)}    // this.onRouteChanged(i.route) } //this.props.onChange(i.route)
            />
          ))}
        </ul>
      </div>
    )
  }
}
VerticalNavigation.defaultProps = {
  activeRoute: null,
  // onChange: () => { },
  title: 'react vertical nav',
  open: false,
}




class ListItems extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      activeRoute: "/" + window.location.href.split('/')[4],
      isSetGlobal: false
    }
  }

  onRouteChanged(rPath) {
    this.setState({ activeRoute: rPath })
    this.props.history.push("/home" + rPath);
  }

  onToggleMenu(open = !this.state.open) {
    this.setState({ open })
  }

  render() {
    const { dbImageUrl, isdrawerOpen } = this.props;
    return (
      <div className='app'>
        <div className='col-1'>
          <VerticalNavigation
            items={_items}
            title='basic nav'
            dbImageUrl={dbImageUrl}
            isdrawerOpen={isdrawerOpen}
            open={this.state.open}
            labname={this.props.labname}
            activeRoute={this.state.activeRoute}
            onRouteClicked={(rname) => this.props.onRouteClicked(rname)}
            onChange={this.onRouteChanged.bind(this)}
          />
        </div>
      </div>
    )
  }
}

export default withRouter(withStyles(styles)(ListItems));