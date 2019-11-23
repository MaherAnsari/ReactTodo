// import { FontIcon } from 'material-ui' // BETTER SOLUTION ;)
import React from 'react';
import './sidebarCss.css';
import { withRouter } from 'react-router-dom';
import { Icon } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';


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
  { name: 'Mandi Data',  route: '/mandi-data', iconClassName: 'work_outline', iconColor: "#e6008a", children: [] },
  { name: 'User List', route: '/user-list', iconClassName: 'supervised_user_circle', iconColor: "#e6008a", children: [] },
  { name: 'Broker Data',  route: '/broker-list', iconClassName: 'local_mall', iconColor: "#e6008a", children: [] },
  { name: 'Buyer Data', route: '/buyer-list', iconClassName: 'shopping_cart', iconColor: "#e6008a", children: [] },
  { name: 'Supplier Data', route: '/supplier-list', iconClassName: 'local_shipping', iconColor: "#e6008a", children: [] },
  { name: 'Rate List', route: '/rate-list', iconClassName: 'local_atm', iconColor: "#e6008a", children: [] },
  { name: 'Commodity List', route: '/comodity-list', iconClassName: 'eco', iconColor: "#e6008a", children: [] }

]


class VerticalItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isHover: false,
    }
  }


  toggleHover(isHover) {
    this.setState({ isHover })
  }

  onSelect(route) {

      this.props.onSelect(route);
      this.toggleHover(false);
    
   
  }

  renderSubLevel(item) {
    const { extended, active } = this.props
    const { isHover } = this.state

    const style = {}
    if (isHover && this._ref !== null
      && ((!active && extended) || (active && !extended) || !active)
    ) {
      const bound = this._ref.getBoundingClientRect()
      //console.log('>>', this._ref.getBoundingClientRect())
      style.transform = `translate3d(${bound.left + bound.width}px, ${bound.top}px, 0px)`
    }


    return (
      <ul className='class_ul sub-level' style={style}>
        {/* <li className='class_li top-item' onClick={() => this.onSelect(item.route)} >
          <div className='item-name'>{item.name}</div>
        </li> */}
        {item.children && item.children.map(i => {
          return (
            <li className="class_li" key={i.route} style={{ background: "#384952 !important", color: "#f5f5fa" }} onClick={() => this.onSelect(i.route)} >
              {/* <i className={i.iconClassName} /> */}
              <Icon className="sideBarIcon">
                {i.iconClassName}
              </Icon>
              <div className='item-name'>{i.name}</div>
            </li>
          )
        })}
      </ul>
    )
  }

  render() {
    const { item, active, isGlobalMode } = this.props
    const { isHover } = this.state; //activeRoute
    let className = 'vertical-item-component';
    // console.log("_--------------_-----_--> " + isGlobalMode);
    if (isHover) className += ' is-hover'
    // if (active) className += ' active'
    // console.log(item,activeRoute,active);
    return (
      <li

        ref={ref => { this._ref = ref }}
        className={className + " class_li"}
        onMouseEnter={() => this.toggleHover(true)}
        onMouseLeave={() => this.toggleHover(false)}

      >
        {isGlobalMode ? <div>
          {item.isGlobal && <div>  <div className='item'  onClick={() => this.onSelect(item.route)}  >
            {/* <i className={item.iconClassName} /> */}
            <Icon className="sideBarIcon" style={{ color: item.iconColor }}>
              {item.iconClassName}
            </Icon>
            <div className='item-name'>{item.name}</div>
          </div>
            {this.renderSubLevel(item)}
          </div>}
        </div> : <div>
            <div className='item' style={{ background:active === item.route ?'#e5e8ec':'#f5f5fa'}}onClick={() => this.onSelect(item.route)}  >
              {/* <i className={item.iconClassName} /> */}
              <Icon className="sideBarIcon" style={{ color: item.iconColor }}>
                {item.iconClassName}
              </Icon>
              <div className='item-name'>{item.name}</div>
              {item.children && item.children.length > 0 && <i className="fa fa-angle-double-right" aria-hidden="true"></i>}
            </div>
            {this.renderSubLevel(item)}
          </div>}


      </li>
    )
  }
}
VerticalItem.defaultProps = {
  item: {},
  extended: false,
  active: false,
}

class VerticalNavigation extends React.PureComponent {


  onRouteChanged(route) {
    this.props.onChange(route);
  }

  render() {
    const { items, open, activeRoute, isGlobalMode, dbImageUrl } = this.props;
    let additionalClass = ''
    additionalClass += open ? 'extended' : 'collapsed'
// console.log(activeRoute)
    return (
      <div className={`vertical-navigation-component ${additionalClass}`}>
        <div className='nav-header' style={{backgroundColor:'#e4e4e8'}}>
          <div>
            <img style={{
              // borderRadius: '50%',
              height: '60px',
              // border: '4px solid #dedede',
              // maxHeight: '80px',
              maxWidth: '200px',
              padding:'10px 10px 10px 10px'
              // marginBottom:'20px',
              // marginTop:'5px'
            }} src={isGlobalMode ? '' : 'https://static.wixstatic.com/media/3ae3ef_e4ffe8f5fc524099b6a01ad4652b5bed~mv2.png/v1/fill/w_153,h_46,al_c,q_80,usm_1.20_1.00_0.01/Bijak%20Agritech%20Logo.webp'} alt={dbImageUrl} />
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
            }} >{isGlobalMode ? "Global Data" : 'Bijak'}</div>
          </Tooltip> */}


        </div>
        <ul className="class_ul"  >
          {items.map((i, index) => (
            <VerticalItem
              key={`vni_${index}`}
              item={i}
              isGlobalMode={isGlobalMode}
              index={index}
              extended={open}
              active={activeRoute}
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
      activeRoute: "/"+window.location.href.split('/')[4],
      isSetGlobal: false
    }
  }

  componentWillMount() {
   
  }


  componentDidUpdate() {

  }

  onRouteChanged(rPath) {
    // console.log(rPath);
    this.setState({activeRoute:rPath})
    this.props.history.push("/home"+ rPath);
  }

  onToggleMenu(open = !this.state.open) {
    this.setState({ open })
  }

  render() {
    const { dbImageUrl } = this.props;
    return (
      <div className='app'>
        <div className='col-1'>
          <VerticalNavigation
            items={_items}
            title='basic nav'
            dbImageUrl={dbImageUrl}
            open={this.state.open}
            labname={this.props.labname}
            activeRoute={this.state.activeRoute}
            isGlobalMode={this.state.isSetGlobal}
            onChange={this.onRouteChanged.bind(this)}
          />
        </div>
      </div>
    )
  }
}

export default withRouter(withStyles(styles)(ListItems));