import React, { useState, useEffect} from 'react';
import Select from '../../custom/selectSearch';
import Joi from 'joi';

const AddGame = (props) => {
    const initialState = { name: '', date: '', championshipId: '', homeTeamId: '', awayTeamId: '',
        homeGoals: '', awayGoals: '' };
    const [ game, setGame ] = useState(initialState);
    const [ error, setError ] = useState(null);
    const [ teams, setTeams] = useState([]);
    const [ champs, setChamps] = useState([]);
    const [ selectedChamp, setSelectedChamp] = useState('');
    const [ selectedHTeam, setSelectedHTeam] = useState('');
    const [ selectedATeam, setSelectedATeam] = useState('');
     

    useEffect(
        () => {
            let teamsApi = props.teams.map(team => {
                return {value: team._id, name: team.name}
            });
            let champsApi = props.championships.map(champ => {
                return {value: champ._id, name: champ.name}
            });

            setTeams(teamsApi);
            setChamps(champsApi);
        }, 
        [props]
    );
    
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

    const handleInputChange = event => {
        const { name, value } = event.target;
        
		setGame({ ...game, [name]: value });
    }

    const gameValidator = () => {
        const {name, date, championshipId, homeTeamId, awayTeamId, homeGoals, awayGoals} = game;
        if (!name) {
            return "Error: Fill Name!"
        }
        if (!date) {
            return "Error: Fill Date!"
        }
        if (!championshipId) {
            return "Error: Select Championship!"
        }
        if (!homeTeamId) {
            return "Error: Select Home Team!"
        }
        if (!awayTeamId) {
            return "Error: Select Away Team!"
        }

        if (!homeGoals) {
            return "Error: Put result in Home Team!"
        }

        if (!awayGoals) {
           return "Error: Put result in Away Team!"
        }

        return null;
    }

    const submitGame = () => {
        let errorMsg = gameValidator();
        if (errorMsg) {
            setError(errorMsg);
        }
        else {
            const { error } = validateGame(game);
            if (error) {
                setError(error.details[0].message);
            }
            else {
                props.addGame(game);
                setGame(initialState);
                setError(null);
                setSelectedChamp('');
                setSelectedHTeam('');
                setSelectedATeam('');
            }
        }
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
                <button onClick={submitGame} >Add</button>
            </div>
            {error && (<span style={errorStyle} className="errorMessage">{error.length > 0 ? error : ''}</span>)}
        </div>
	)
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

function validateGame(game) {

    const schema = {
        name: Joi.string().min(5).max(50).required(),
        date: Joi.date().required(),
        championshipId: Joi.string().min(24).required(),
        homeTeamId: Joi.string().min(24).required(),
        awayTeamId: Joi.string().min(24).required(),
        homeGoals: Joi.number().min(0).required(),
        awayGoals: Joi.number().min(0).required()
    };

    return Joi.validate(game, schema);
}

export default AddGame;