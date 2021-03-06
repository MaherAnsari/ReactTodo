import React from "react";
import App from "../../routes/index";
import {useSelector} from "react-redux";
import {useRouteMatch} from "react-router-dom";
import TopBar from '../../components/topBar'



const MainApp = () => {

//   const {width, navStyle} = useSelector(({settings}) => settings);
  const match = useRouteMatch();


 
  return (
    <div className="gx-app-layout">
     <TopBar/>
      <div>
     
        <div className={`gx-layout-content`}>
          <App match={match}/>
        </div>
      </div>

    </div>
  )
};
export default MainApp;

