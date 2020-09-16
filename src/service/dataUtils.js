import axios from 'axios';
import {server_url} from './config';

const ServiceData = {
    execute: async function(path, options) {
        let baseUrl = server_url;//'http://localhost:5000/api/';
    
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
        let baseUrl = server_url;//'http://localhost:5000/api/';
    
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

    seasonExecute: async function(pathSeason, pathGame, options) {
        let baseUrl = server_url;//'http://localhost:5000/api/';
    
        let result = {};
        try {
            await axios.all([
                axios(baseUrl + pathSeason, options),
                axios(baseUrl + pathGame, options)
            ])
            .then(axios.spread(function (seasons, games) {
                result.seasons = seasons.data || [];
                result.games = games.data || [];
              }))
        } catch (error) {
            console.log(error);
            result.error = error.response.data;
        }

        return result;
    },

    paymentExecute: async function(pathPayment, pathUser, options) {
        let baseUrl = server_url;//'http://localhost:5000/api/';
    
        let result = {};
        try {
            await axios.all([
                axios(baseUrl + pathPayment, options),
                axios(baseUrl + pathUser, options)
            ])
            .then(axios.spread(function (payments, users) {
                result.payments = payments.data || [];
                result.users = users.data || [];
              }))
        } catch (error) {
            console.log(error);
            result.error = error.response.data;
        }

        return result;
    },

    homeExecute: async function(pathMe, pathSeason, pathStatus, options) {
        let baseUrl = server_url;//'http://localhost:5000/api/';
        
        let result = {};
        try {
            await axios.all([
                axios(baseUrl + pathMe, options),
                axios(baseUrl + pathSeason, options),
                axios(baseUrl + pathStatus, options)
            ])
            .then(axios.spread(function (me, seasons, status) {
                result.me = me.data || '';
                result.seasons = seasons.data || [];
                result.status = status.data || [];
              }))
        } catch (error) {
            console.log(error);
            result.error = error.response.data;
        }

        return result;
    },

    normalUserExecute: async function(pathMe, pathSeason, pathStatus, options) {
        let baseUrl = server_url;//'http://localhost:5000/api/';
        
        let result = {};
        try {
            await axios.all([
                axios(baseUrl + pathMe, options),
                axios(baseUrl + pathSeason, options),
                axios(baseUrl + pathStatus, options)
            ])
            .then(axios.spread(function (me, seasons, status) {
                result.me = me.data || '';
                result.seasons = seasons.data || [];
                result.status = status.data || [];
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