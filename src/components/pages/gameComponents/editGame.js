import React, { useState, useEffect } from 'react';
import Select from '../../custom/selectSearch';

const EditGame = (props) => {
    const [ game, setGame ] = useState(props.currentGame);
    const [ teams, setTeams] = useState([]);
    const [ champs, setChamps] = useState([]);
    const [ selectedChamp, setSelectedChamp] = useState(props.currentGame.championshipId);
    const [ selectedHTeam, setSelectedHTeam] = useState(props.currentGame.homeTeamId);
    const [ selectedATeam, setSelectedATeam] = useState(props.currentGame.awayTeamId);
    const [ error, setError ] = useState(null);

    useEffect(
        () => {
            setGame(props.currentGame);
            let teamsApi = props.teams.map(team => {
                return {value: team._id, name: team.name}
            });
            let champsApi = props.championships.map(champ => {
                return {value: champ._id, name: champ.name}
            });

            setTeams(teamsApi);
            setChamps(champsApi);
            setSelectedChamp(props.currentGame.championshipId);
            setSelectedHTeam(props.currentGame.homeTeamId);
            setSelectedATeam(props.currentGame.awayTeamId)
        }, 
        [props]
    );

    const handleEdit = () => {
        props.setEditing(false);
    }

    const handleInputChange = e => {
        const {name, value } = e.target;

        setGame({ ...game, [name]: value });
    }

    const onChangeChamp = value => {
        setSelectedChamp(value);
        
        game.championshipId = value;
        setGame(game);

    }

    const onChangeHTeam = value => {
        
        if (game.awayTeamId !== value || !selectedATeam !== value) {
            setSelectedHTeam(value);
            game.homeTeamId = value;
            setGame(game);
            setError(null);
        }
        else {
            const name = getTeamName(value, teams);
            setSelectedHTeam('');
            setError(`Error: Team ${name} is selected in Away Team!`);
        }
    }

    const onChangeATeam = value => {
       
        if (game.homeTeamId !== value || selectedHTeam !== value) {
            setSelectedATeam(value);
            game.awayTeamId = value;
            setGame(game);
            setError(null);
        }
        else {
            const name = getTeamName(value, teams);
            setSelectedATeam('');
            setError(`Error: Team ${name} is selected in Home Team!`);
        }
        
    }

    const handleUpdate = () => {
        props.updateGame(game);
    }

    return (
        <div className="form">
            <div className="form-group" >
                <label htmlFor="name">Name</label>
                <input type="text" name="name" value={game ? game.name : ''} onChange={handleInputChange}/>
            </div>
            <div className="form-group" >
                <label htmlFor="date">Date</label>
                <input type="date" name="date" value={game ? game.date : ''} onChange={handleInputChange}/>
            </div>
            <div className="form-group" >
                <label htmlFor="championshipId">Championship</label>
                <Select 
                    name="championshipId" 
                    options={champs} 
                    hint="select championship" 
                    onChange={onChangeChamp} 
                    value={selectedChamp}
                />
            </div>
            <div className="form-group" >
                <label htmlFor="homeTeamId">Home</label>
                <div className="joiner">
                    <Select
                        name="homeTeamId" 
                        options={teams} 
                        hint="select home team" 
                        onChange={onChangeHTeam} 
                        value={selectedHTeam}
                    />
                    <input style={scoreValue} type="text" name="homeGoals" value={game ? game.homeGoals : ''} onChange={handleInputChange}/>
                </div>
            </div>
            <div className="form-group" >
                <label htmlFor="awayTeamId">Away</label>
                <div className="joiner">
                    <Select
                        name="awayTeamId" 
                        options={teams} 
                        hint="select away team" 
                        onChange={onChangeATeam} 
                        value={selectedATeam}
                    />
                    <input style={scoreValue} type="text" name="awayGoals" value={game ? game.awayGoals : ''} onChange={handleInputChange}/>
                </div>
            </div>
            <div className="button-joiner">
                <button onClick={handleUpdate} >Update</button>
                <button onClick={handleEdit} className="button muted-button">Cancel</button>
            </div>
            {error && (<span style={errorStyle} className="errorMessage">{error.length > 0 ? error : ''}</span>)}
        </div>
    );
}

const scoreValue = {
    minWidth: "3em",
    maxWidth: "3em"
}

const errorStyle = {
    paddingTop: "15px",
	textShadow: "10px 10px 10px",
    color: "red"
}

function getTeamName(value, teams) {
    const team = teams.find((team) => team.value === value);
    console.log(team);
    return team.name;
}

export default EditGame;