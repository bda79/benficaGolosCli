import React from 'react';
import './App.scss';
import { AllRoutes } from './routes/allRoutes';
import * as isHerokuSleeping from 'react-use-heroku';
import loginImg from '../src/img/Slb-spinner.gif';
import {server_url} from './service/config';

const url = `${server_url}/wake-up`;

function App() {
  console.log(process.env.NODE_ENV)
  if (process.env.NODE_ENV !== 'development' && isHerokuSleeping({ url })) return ( 
    <div id="loader-wu">
      <div className="loader">
        <img src={loginImg} alt="" />
      </div>
      <div>Waking Up App...</div>
    </div> )
 
  return (
    <AllRoutes />
  );
}

export default App;
