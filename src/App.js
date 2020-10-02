import React, {useEffect, useState} from 'react';
import './App.scss';
import { AllRoutes } from './routes/allRoutes';
import loginImg from '../src/img/Slb-spinner.gif';
import ServiceData from "../src/service/dataUtils";
import { Wave } from 'react-animated-text';

const App = () => {
  const [ loading, setLoading ] = useState(true);
  const [ connectionError, setConnectionError] = useState(null);

  const awake = async () => {
    const headers = ServiceData.headers();
    const options = ServiceData.options('GET', null, headers);
    await ServiceData.execute('wake-up', options)
        .then((res) => {
            if (res.data) {
              setLoading(false);
              setConnectionError(null)
            }
        })
        .catch(err => {
            console.log(err);
            setConnectionError('Error: Server is Down!');
        });
  };

  useEffect(() => {
    awake();
  }, []);


  if (loading) {
     return (
      <div id="loader-wu">
        <div style={{
          fontSize: '15px',
          fontWeight: 'bold',
          color: 'red',
          margin: '5px 0'
        }}>
        {connectionError && connectionError.length > 0 && (
          <Wave text={connectionError} 
            effect="stretch" 
            effectChange={2} />
        )}
        </div>
        <div className="loader">
          <img src={loginImg} alt="" />
        </div>
        <div style={{
          fontSize: '15px',
          fontWeight: 'bold',
          margin: '5px 0'
        }}> 
          <Wave text='Waking Up App...' 
            effect="stretch" 
            effectChange={2} />
        </div>
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
