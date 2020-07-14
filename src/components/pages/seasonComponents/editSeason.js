import React, { useState, useEffect} from 'react';
import ReactTable from '../../custom/bootstraptab';
import GameModal from './gameModal';
import Switch from "react-switch";
import {ImageUtils} from '../../../service/utils';
import moment from 'moment';
import './season.scss';

const EditSeason = (props) => {
   
    const [ season, setSeason ] = useState(props.currentSeason);
    const [ open, setOpen ] = useState(false);
    const [ bdGames, setBDGames ] = useState(props.games);
    const [ games, setGames ] = useState([]);
    const [ game, setGame ] = useState(null);
    const [ error, setError ] = useState(null);
    const [ mode, setMode ] = useState(true);

    useEffect(
        () => {
            setSeason(props.currentSeason);
            setBDGames(props.games);
        }, 
        [props]
    );

    const handleClick = (value) => {
        setMode(!value);
    }

    const handleInputChange = event => {
        const { name, value } = event.target;
        
		setSeason({ ...season, [name]: value });
    }

    const handleUpdate = () => {
        setError(null);
        props.updateSeason(season);
    }

    const handleEdit = () => {
        setError(null);
        props.setEditing(false);
    }

    const openModal = (values) => {
        console.log(values)

        const f_games = filterGames(mode, values);

        setOpen(true);
        setGames(f_games);
    }

    const filterGames = (filter, values) =>{
        if (filter) {
            const f_games = bdGames.filter(bd => 
                !isInArray(bd._id, values) && 
                inRange(bd.date, season.begin, season.end));
            return f_games;
        }

        return values;
    }

    const isInArray = (id, values) => {
        return values.find(v => v._id === id);
    }

    const inRange = (date, begin, end) => {
        const value = moment(date).isBetween(begin, end);
        return value;
    }

    const closeModal = () => {
        setOpen(false);
        setGames([]);
    }

    const handleMode = (value) => {
        console.log("HandleMode", value);
        if (value) {
            addGame();
        }
        else {
            deleteGame();
        }
    }

    const deleteGame = () => {
        props.removeGame(season._id, game._id);
        setGame(null);
        setError(null);
        setOpen(false);
    }

    const addGame = () => {
        props.addGame(season._id, game._id);
        setGame(null);
        setError(null);
        setOpen(false);
    }

    const selectRow = {
        mode: 'radio',
        clickToSelect: true,
        hideSelectAll: true,
        onSelect: (row, isSelect, rowIndex, e) => {
          if (isSelect) {
              setGame(row);
          }
        }
    }; 

    return (
        <div className="form">
            <div className="form-group" >
                <label htmlFor="name">Name</label>
                <input type="text" name="name" value={season ? season.name : ''} onChange={handleInputChange}/>
            </div>
            <div className="form-group" >
                <label htmlFor="begin">Begin Date</label>
                <input type="date" name="begin" value={season ? season.begin : ''} onChange={handleInputChange}/>
            </div>
            <div className="form-group" >
                <label htmlFor="end">End Date</label>
                <input type="date" name="end" value={season ? season.end : ''} onChange={handleInputChange}/>
            </div>
            <div className="button-joiner">
                <button onClick={handleUpdate} >Update</button>
                <button onClick={handleEdit} className="button muted-button">Cancel</button>
            </div>
            {error && (<span style={errorStyle} className="errorMessage">{error.length > 0 ? error : ''}</span>)}
            <div className="form">
                <div className="form-group form-edit" >
                    <label htmlFor="mode" className="toggle-label">
                        <Switch
                            name="mode"
                            checked={mode}
                            onChange={()=> handleClick(mode)}
                            className="toggle"
                        />
                        <span>{`${mode ? 'Add' : 'Delete'} Game`}</span>
                    </label>
                    <label htmlFor="game">Game</label>  
                    <div className="joiner">
                        <input type="text" name="game" readOnly value={game ? game.name : ''} />
                        <button className="selectBtn" onClick={()=> openModal(season.games)} >Show</button>
                    </div>
                </div>
                <div className="button-joiner">
                    <button onClick={()=> handleMode(mode)} >{mode ? 'Add' : 'Delete'}</button>
                </div>
            </div>
            <GameModal 
                    show={open}
                    onClose={closeModal}>
                    <div>Games</div>
                    <ReactTable listData={games} columns={gameColumns} defaultSorted={defaultSorted} maxRows={5} selectRow={selectRow} />
            </GameModal>
        </div>
	)
}

const gameColumns = [
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
]

const defaultSorted = [{dataField: 'name', order: 'asc' }];

const errorStyle = {
    paddingTop: "15px",
	textShadow: "10px 10px 10px",
    color: "red"
}

export default EditSeason;