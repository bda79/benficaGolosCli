import React from "react";
import { Redirect } from 'react-router-dom';
import ServiceData from "../../../service/dataUtils";
import Storage from "../../../service/StorageData";
import moment from 'moment';
import './home.scss';
import ReactTable from '../../custom/bootstraptab';
import {ImageUtils} from '../../../service/utils';
import Select from '../../custom/selectSearch';

export class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          isLogged: true,
          user: '',
          seasons: [],
          mapSeasons: [],
          games: [],
          status: [],
          currentSeason: null,
          selectedSeason: null
        }
    }

    fillState = async (data, seasonId) => {
        if (data.me) {
            const user = data.me;
            this.setState({
                user: user
            });
            Storage.add('cUser', user);
            this.props.onChange(user);
        }
        if (data.seasons) {
            const size = data.seasons.length;
            const dbSeasons = data.seasons;
            let currentSeason = {};
            if (seasonId) {
                const current = dbSeasons.filter(function(s){return s._id === seasonId});
                currentSeason = current[0];
            } 
            else {
                currentSeason = dbSeasons[size === 0 ? size : size - 1];
            }
            let seasonApi = dbSeasons.map(season => {
                return {value: season._id, name: season.name}
            });
            this.setState({
                seasons: dbSeasons,
                mapSeasons: seasonApi,
                currentSeason: currentSeason,
                selectedSeason: currentSeason._id,
                games: currentSeason.games
            })
        }
        if (data.status) {
            const mapStatus = data.status.map(status => {
                return {_id: status.user, user: status.user, goals: status.goals, pay: status.pay, nPay: status.nPay}
            });
            this.setState({
                status: mapStatus
            })
        }
        if (data.error) {
            console.log("Error: ", data.error);
        }
    }

    onChangeSeason = (value) => {
        const token = Storage.get('token');
        getData(token, value)
        .then((data) => {
            this.fillState(data, value);
        })
        .catch(err => {
           console.log('Error', err); 
        });

    }

    componentDidMount() {
        const token = Storage.get('token');
        
        if (token) {
            getCurrentData(token)
                .then((data) => {
                    this.fillState(data);
                })
                .catch(err => {
                   console.log('Error', err); 
                });
        }
        else {
            this.setState({isLogged: false});
        }
    }

    render() {
        const {isLogged, games, status, mapSeasons, selectedSeason, currentSeason} = this.state;
       
        if (!isLogged) {
            return (<Redirect to={'/login'}/>);
        }
          
          return (
            <div className="home_container">
                <div className="flex-item">
                    <div className="flex_from">
                        <div className="flex_form-group" >
                            <div className="season_group">
                                <label className="flex_label" htmlFor="SeasonId">Season</label>
                                <Select 
                                    name="seasonId" 
                                    options={mapSeasons} 
                                    hint="select season" 
                                    onChange={this.onChangeSeason}
                                    value={selectedSeason}
                                />
                            </div>
                            <div className="goals_group">
                                <div className="season_goals">
                                    <label className="flex_label">Total Goals
                                        <span className="goals">{currentSeason != null ? currentSeason.goals : 0}</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <GameTable games={games} />
                </div>
                <div className="fixed">
                    <StatusTable status={status}/>
                </div>
            </div>
          );
    }
}

const StatusTable = (props) => {
    const columns = [
        { dataField: 'key', text: 'Key', hidden: true},
        { dataField: 'user', text: 'User', sort: true, headerAlign: 'center', 
            footerAlign: (column, colIndex) => 'left',
            footer: 'Total'
        },
        { dataField: 'pay', text: 'Pay', sort: true, headerAlign: 'center',
            formatter: (cell, row) => {
                return (<div className="score-box">
                            {row.pay}
                        </div>);
            },
            footer: columnData => columnData.reduce((acc, item) => acc + item, 0)
        },
        { dataField: 'nPay', text: 'Not Pay', sort: true, headerAlign: 'center',
            formatter: (cell, row) => {
                return (<div className="score-box">
                            {row.nPay}
                        </div>);
            },
            footer: columnData => columnData.reduce((acc, item) => acc + item, 0)
        }
    ];

    const defaultSorted = [{dataField: 'date', order: 'desc' }];

    return(<ReactTable listData={props.status} columns={columns} defaultSorted={defaultSorted} maxRows={4} />);
}

const GameTable = (props) => {

    const columns = [
        { dataField: '_id', text: 'ID', hidden: true }, 
        { dataField: 'name', text: 'Name', sort: true, headerAlign: 'center' },
        { dataField: 'date', text: 'Date', sort: true, headerAlign: 'center', 
          formatter: (cell, row) => {
            return (
                <div style={{textAlign:"center"}}className="date-center">
                    {`${moment(row.date).format("DD-MM-YYYY")? moment(row.date).format("DD-MM-YYYY"):moment(row.date).format("DD-MM-YYYY") }`}
                </div>
            );
          }
        },
        { dataField: 'championship._id', text: 'CH_ID', hidden: true},
        { dataField: 'championship.name', text: 'Championship', sort: true, headerAlign: 'center'},
        { dataField: 'homeTeam._id', text: 'HOME_ID', hidden: true},
        { dataField: 'homeTeam.logo', text: 'Home', headerAlign: 'center',
          formatter: (cell, row) => {
            return (
            <div className="logo">
                {row.homeTeam.logo && ( <img src={ImageUtils.getImage(row.homeTeam.logo)} alt=""/> )}
            </div>)
          } 
        },
        { dataField: 'awayTeam._id', text: 'AWAY_ID', hidden: true},
        { dataField: 'awayTeam.logo', text: 'Away', headerAlign: 'center',
          formatter: (cell, row) => {
            return (
            <div className="logo">
                {row.awayTeam.logo && ( <img src={ImageUtils.getImage(row.awayTeam.logo)} alt=""/> )}
            </div>)
          } 
        }, 
        { dataField: 'score', text: 'Score', isDummyField: true,
          formatter: (cell, row) => {
              return (<div style={{textAlign:"center"}} className="score-board">
                        <div style={{display:"inline-block", padding: "2px"}} className="team">
                            <div className="score-box">
                                {row.homeGoals}
                            </div>
                        </div>
                        <div style={{display:"inline-block", padding: "2px"}} className="separator">-</div>
                        <div style={{display:"inline-block", padding: "2px"}} className="team">
                            <div className="score-box">
                                {row.awayGoals}
                            </div>
                        </div>
                    </div>
            )}
        }
    ];
      
    const defaultSorted = [{dataField: 'date', order: 'desc' }];

    return(<ReactTable listData={props.games} columns={columns} defaultSorted={defaultSorted} maxRows={4} />);
}

async function getCurrentData(token) {
    let result = {}

    const headers = ServiceData.headers(token);
    const options = ServiceData.options('GET', null, headers);

    await ServiceData.execute('seasons/current', options)
    .then(async (data) => {
        const seasonId = data.data._id;
        const statusPath = `status/${seasonId}`;
        result.seasonId = seasonId;

        await ServiceData.homeExecute('users/me', 'seasons', statusPath, options)
        .then((res) => {
            result.me = res.me;
            result.seasons = res.seasons;
            result.status = res.status;
        })
        .catch(err => {
            result.error = err;
        })
    })
    .catch(err => {
        result.error = err;
    });

    return result;
}

async function getData(token, seasonId) {
    let result = {}

    const headers = ServiceData.headers(token);
    const options = ServiceData.options('GET', null, headers);

    const statusPath = `status/${seasonId}`;
        result.seasonId = seasonId;

        await ServiceData.homeExecute('users/me', 'seasons', statusPath, options)
        .then((res) => {
            result.me = res.me;
            result.seasons = res.seasons;
            result.status = res.status;
        })
        .catch(err => {
            result.error = err;
        })
    
    return result;
}