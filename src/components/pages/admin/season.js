import React, { useState, useEffect, Fragment } from "react";
import AddSeason from "../seasonComponents/addSeason";
import EditSeason from "../seasonComponents/editSeason";
import SeasonTable from "../seasonComponents/seasonTable";
import ServiceData from "../../../service/dataUtils";
import Storage from "../../../service/StorageData";
import moment from 'moment';

const Season = () => {
    const [ error, setError ] = useState(null);
    const [ seasons, setSeasons ] = useState([]);
    const [ games, setGames ] = useState([]);
    const [ currentSeason, setCurrentSeason ] = useState(
        { _id: '', name: '', begin: '', end: '', goals: '', games: [] });
    const [ editing, setEditing ] = useState(false);

        useEffect(() => {
            const token = Storage.get('token');
            if (token) {
                loadData(token)
                .then((data) => {
                    
                    if (data.games) {
                        setGames(data.games);
                        setError(null);
                    }
                    if (data.seasons) {
                        setSeasons(data.seasons);
                        setError(null);
                    }
                    if (data.error) {
                        setError( data.error );
                    }
                })
                .catch(err => {
                    console.log("Error: ", err);
                })
            }
    
        }, [currentSeason]);

    //Crud operations
    const _addSeason = async (season) => {
		
		const {error, data} = await addSeasonInBD(season);
		if (data) {
			setSeasons([ ...seasons, data ]);
			setError(null); 
		}
		if (error) {
			setError(error);
		}
    }

    const addSeasonInBD = async (season) => {
		return await saveSeasonBD(season);
	}

    const deleteSeason = async (id) => {
		setEditing(false);
		
		const {error, data} = await deleteSeasonBD(id);
		if (data) {
			const bdSeason = data;
			setSeasons(seasons.filter(season => season._id !== bdSeason._id));
			setError(null);
		}
		if (error) {
			setError(error);
		}
		
    }
    
    const updateSeason = async (season) => {
		
		const id = season._id;
		const toUpdate = seasons.find((season) => season._id === id);
		
		if (toUpdate) {
			const {data, error} = await saveSeasonBD(season);
			if (data) {
				let bdSeason = data;
				setEditing(false);
				setSeasons(seasons.map(season => (season._id === bdSeason._id ? bdSeason : season)));
				setError(null);
			}
			if (error) {
				console.log(error);
				setError(error);
			}
		} 
		else {
			setError('Nothing change!');
		}
	}
	
	const addGame = async (seasonId, gameId) => {
		console.log("ADD_GAME", seasonId, gameId);
		const {data, error} = await addSeasonGame(seasonId, gameId);
		if (data) {
			let bdSeason = data;
			setEditing(false);
			setSeasons(seasons.map(season => (season._id === bdSeason._id ? bdSeason : season)));
			setError(null);
		}
		if (error) {
			console.log(error);
			setError(error);
		}
	}

	const removeGame = async (seasonId, gameId) => {
		console.log("REMOVE_GAME", seasonId, gameId);
		const {data, error} = await removeSeasonGame(seasonId, gameId);
		if (data) {
			let bdSeason = data;
			setEditing(false);
			setSeasons(seasons.map(season => (season._id === bdSeason._id ? bdSeason : season)));
			setError(null);
		}
		if (error) {
			console.log(error);
			setError(error);
		}
	}
    
    const editRow = season => {
		setEditing(true);
		const {games} = season;

		setCurrentSeason({ 
			_id: season._id, 
			name: season.name, 
            begin: moment(season.begin).format("yyyy-MM-DD"),
            end: moment(season.end).format("yyyy-MM-DD"),
			goals: season.goals, 
			games: games
		});
    }


    return display(error, editing, seasons, games, setEditing, currentSeason, updateSeason, _addSeason, editRow, deleteSeason, addGame, removeGame);

}

function display(error, editing, seasons, games, setEditing, currentSeason, updateSeason, _addSeason, editRow, deleteSeason, addGame, removeGame) {
    return (
        <div className="main">
            <div className="flex-container">
                <div className="column-game">
                    {editing ? (
                        <Fragment>
                            <h2>Edit Season</h2>
                            <EditSeason
                                editing={editing}
                                setEditing={setEditing}
                                currentSeason={currentSeason}
                                updateSeason={updateSeason}
								games={games}
								addGame={addGame}
								removeGame={removeGame}
                            />
                        </Fragment>
                    ) : (
                        <Fragment>
                            <h2>Add Season</h2>
                            <AddSeason addSeason={_addSeason} />
                        </Fragment>
                    )}
                </div>
                <div className="column-game-table">
                    <h2>View Season</h2>
                    <SeasonTable seasons={seasons} editRow={editRow} deleteSeason={deleteSeason} />
                </div>
            </div>
            {error && (<span style={errorStyle} className="errorMessage">{error.length > 0 ? error : ''}</span>)}
        </div>
    )
}

const errorStyle = {
	textShadow: "10px 10px 10px",
    color: "red"
}

const loadData = async (token) => {
	const headers = ServiceData.headers(token);
	const options = ServiceData.options('GET', null, headers);
	return await ServiceData.seasonExecute('seasons', 'games', options);
}

const saveSeasonBD = async (season) => {
	let result = {};
	const token = Storage.get('token');
	let path = `seasons/${season._id}`;
	let method = 'PUT'
	if (!season._id) {
		path = "seasons";
		method = "POST";
	}
	
	const headers = ServiceData.headers(token);
	const options = ServiceData.options(method, season, headers);
	
	await ServiceData.execute(path, options)
		.then((data) => {
			if (data.data) {
				result.data = data.data;
			}
			if (data.error) {
				result.error = data.error;
			}
			
		})
		.catch(err => {
			console.log("GetSeason Error: ", err);
			result.error = err.response.data;
		});
	
	return result;
}

const addSeasonGame = async(seasonId, gameId) => {
	let result = {};
	const token = Storage.get('token');
	let path = `seasons/${seasonId}/addGame`;
	let method = 'PUT'
	
	const data = { gameId: gameId};

	const headers = ServiceData.headers(token);
	const options = ServiceData.options(method, data, headers);
	
	await ServiceData.execute(path, options)
		.then((data) => {
			if (data.data) {
				result.data = data.data;
			}
			if (data.error) {
				result.error = data.error;
			}
			
		})
		.catch(err => {
			console.log("AddSeasonGame Error: ", err);
			result.error = err.response.data;
		});
	
	return result;
}

const removeSeasonGame = async(seasonId, gameId) => {
	let result = {};
	const token = Storage.get('token');
	let path = `seasons/${seasonId}/deleteGame`;
	let method = 'PUT'
	
	const data = { gameId: gameId};

	const headers = ServiceData.headers(token);
	const options = ServiceData.options(method, data, headers);
	
	await ServiceData.execute(path, options)
		.then((data) => {
			if (data.data) {
				result.data = data.data;
			}
			if (data.error) {
				result.error = data.error;
			}
			
		})
		.catch(err => {
			console.log("DeleteSeasonGame Error: ", err);
			result.error = err.response.data;
		});
	
	return result;	
}

const deleteSeasonBD = async (id) => {
	let result = {};
	const token = Storage.get('token');
	const path = `seasons/${id}`;

	const headers = ServiceData.headers(token);
	const options = ServiceData.options('DELETE', null, headers);

	await ServiceData.execute(path, options)
		.then((data) => {
			if (data.data) {
				result.data = data.data;
			}
			if (data.error) {
				result.error = data.error;
			}
		})
		.catch(err => {
			console.log("GetSeason Error: ", err);
			result.error = err.response.data;
		});
	
	return result;
}

export default Season;