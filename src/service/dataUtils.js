import axios from 'axios';

const ServiceData = {
    execute: async function(path, options) {
        let baseUrl = 'http://localhost:5000/api/';
    
        let result = {};
        try {
            console.log("DB call: ", baseUrl, path, options);
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

    gameExecute: async function(pathGame, pathChamp, pathTeam, options) {
        let baseUrl = 'http://localhost:5000/api/';
    
        let result = {};
        try {
            await axios.all([
                axios(baseUrl + pathGame, options),
                axios(baseUrl + pathChamp, options),
                axios(baseUrl + pathTeam, options)
            ])
            .then(axios.spread(function (games, champs, teams) {
                result.games = games.data || [];
                result.champs = champs.data || [];
                result.teams = teams.data || [];
              }))
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