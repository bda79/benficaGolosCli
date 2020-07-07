import axios from 'axios';

const ServiceData = {
    execute: async function(path, options) {
        let baseUrl = 'http://localhost:5000/api/';
    
        let result = {};
        try {
            await axios(baseUrl + path, options)
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
    },

    options: function(method, userData, headers) {
        const options = {};

        options.method = method;
        if (userData)
            options.data = userData;
        
        if (headers) 
            options.headers = headers;
        
        return options;
    },

    headers: function(token, file) {
        let headers = {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        }

        if (token) {
            headers = {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'x-auth-token': token
            }
        }

        if (file) {
            console.log("is file-------")
            headers = {
                'Access-Control-Allow-Origin': '*',
                'x-auth-token': token,
                'Content-Type': 'multipart/form-data'
            }
        }

        return headers;
    }
}

export default ServiceData;