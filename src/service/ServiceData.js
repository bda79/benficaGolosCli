import axios from 'axios';

export async function ServiceData(type, method, data) {
    let baseUrl = 'http://localhost:5000/api/';
    

    let result = {};
    try {
        await axios(baseUrl + type, {
          method: method,
          data: data,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          }
        }).then(response => { 
          if (response.data) {
            result.data = response.data;
          } 
        })
    } catch (error) {
        console.log(error);
        result.error = error.response.data;
    }

      return result;
}