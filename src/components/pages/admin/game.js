import React, { useState, useEffect, Fragment } from "react";
import AddGame from "../gameComponents/addGame";
import EditGame from "../gameComponents/editGame";
import GameTable from "../gameComponents/gameTable";
import ServiceData from "../../../service/dataUtils";
import Storage from "../../../service/StorageData";
import moment from 'moment';

const Game = () => {

    const [ error, setError ] = useState(null);
	const [ games, setGames ] = useState([]);
	const [ championships, setChampionships ] = useState([]);
	const [ teams, setTeams ] = useState([]);
    const [ currentGame, setCurrentGame ] = useState(
		{ _id: '', name: '', date: '', championshipId: '', homeTeamId: '', awayTeamId: '', homeGoals: '', awayGoals: '' });
	
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
				if (data.champs) {
					setChampionships(data.champs);
					setError(null);
				}
				if (data.teams) {
					setTeams(data.teams);
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

    }, [currentGame]);

    //Crud operations
    const _addGame = async (game) => {
		
		const {error, data} = await addGameInBD(game);
		if (data) {
			setGames([ ...games, data ]);
			setError(null); 
		}
		if (error) {
			setError(error);
		}
    }

    const addGameInBD = async (game) => {
		return await saveGameBD(game);
	}

    const deleteGame = async (id) => {
		setEditing(false);
		
		const {error, data} = await deleteGameBD(id);
		if (data) {
			const bdGame = data;
			setGames(games.filter(game => game._id !== bdGame._id));
			setError(null);
		}
		if (error) {
			setError(error);
		}
		
    }
    
    const updateGame = async (game) => {
		
		const id = game._id;
		const toUpdate = games.find((game) => game._id === id);
		
		if (toUpdate) {
			const {data, error} = await saveGameBD(game);
			if (data) {
				let bdGame = data;
				setEditing(false);
				setGames(games.map(game => (game._id === bdGame._id ? bdGame : game)));
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
    
    const editRow = game => {
		setEditing(true);
		const {championship, homeTeam, awayTeam} = game;

		setCurrentGame({ 
			_id: game._id, 
			name: game.name, 
			date: moment(game.date).format("yyyy-MM-DD"), 
			championshipId: championship._id, 
			homeTeamId: homeTeam._id, 
			awayTeamId: awayTeam._id,
			homeGoals: game.homeGoals, 
			awayGoals: game.awayGoals 
		});
    }


    return display(error, editing, games, championships, teams, setEditing, currentGame, updateGame, _addGame, editRow, deleteGame);
}

function display(error, editing, games, championships, teams, setEditing, currentGame, updateGame, _addGame, editRow, deleteGame) {
    return (
        <div className="main">
            <div className="flex-container">
                <div className="column-game">
                    {editing ? (
                        <Fragment>
                            <h2>Edit Game</h2>
                            <EditGame
                                editing={editing}
                                setEditing={setEditing}
                                currentGame={currentGame}
                                updateGame={updateGame}
								championships={championships} 
								teams={teams}
                            />
                        </Fragment>
                    ) : (
                        <Fragment>
                            <h2>Add Game</h2>
                            <AddGame addGame={_addGame} championships={championships} teams={teams} />
                        </Fragment>
                    )}
                </div>
                <div className="column-game-table">
                    <h2>View Games</h2>
                    <GameTable games={games} editRow={editRow} deleteGame={deleteGame} />
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
	return await ServiceData.gameExecute('games', 'championships', 'teams', options);
}

const saveGameBD = async (game) => {
	let result = {};
	const token = Storage.get('token');
	let path = `games/${game._id}`;
	let method = 'PUT'
	if (!game._id) {
		path = "games";
		method = "POST";
	}
	
	const headers = ServiceData.headers(token);
	const options = ServiceData.options(method, game, headers);
	
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
			console.log("GetGame Error: ", err);
			result.error = err.response.data;
		});
	
	return result;
}

const deleteGameBD = async (id) => {
	let result = {};
	const token = Storage.get('token');
	const path = `games/${id}`;

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
			console.log("GetGame Error: ", err);
			result.error = err.response.data;
		});
	
	return result;
}


export default Game;