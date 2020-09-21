import React, {useEffect, useState} from 'react';
import './App.scss';
import { AllRoutes } from './routes/allRoutes';
import loginImg from '../src/img/Slb-spinner.gif';
import ServiceData from "../src/service/dataUtils";

const App = () => {
  const [ loading, setLoading ] = useState(true);

  const awake = async () => {
    const headers = ServiceData.headers();
    const options = ServiceData.options('GET', null, headers);
    await ServiceData.execute('wake-up', options)
        .then((res) => {
            if (res.data)
              setLoading(false);
            
        })
        .catch(err => {
            console.log(err);
        });
  };

  useEffect(() => {
    awake();
  }, []);

  if (loading) {
     return (
      <div id="loader-wu">
        <div className="loader">
          <img src={loginImg} alt="" />
        </div>
        <div>Waking Up App...</div>
      </div>
    )
  }
  else {
   return (
      <AllRoutes />
    );
  }
};

export default App;
