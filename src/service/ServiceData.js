import axios from 'axios';

export async function ServiceData(type, method, data, header) {
    let baseUrl = 'http://localhost:5000/api/';
    
    let result = {};
    const options = getOptions(method, data, header);

    try {
        await axios(baseUrl + type, options)
         .then(response => { 
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

function getOptions(method, userData, header) {
    const options = {};

    let headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    }

    options.method = method;
    if (userData)
        options.data = userData;
    
    if (header) {
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'x-auth-token': header
        }
    }

    options.headers = headers;

    return options;
}