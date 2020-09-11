import React, { useState} from 'react';
import Joi from 'joi';

const AddSeason = (props) => {
    const initialState = {name: '', begin:'', end: ''};
    const [ season, setSeason ] = useState(initialState);
    const [ error, setError ] = useState(null);

    const handleInputChange = event => {
        const { name, value } = event.target;
        
		setSeason({ ...season, [name]: value });
    }

    const seasonValidator = () => {
        const {name, begin, end} = season;
        if (!name) {
            return "Error: Fill Name!"
        }
        if (!begin) {
            return "Error: Fill Begin Date!"
        }
        if (!end) {
            return "Error: Fill End Date!"
        }

        return null;
    }

    const submitSeason = () => {
        let errorMsg = seasonValidator();
        if (errorMsg) {
            setError(errorMsg);
        }
        else {
            const { error } = validateSeason(season);
            if (error) {
                setError(error.details[0].message);
            }
            else {
                props.addSeason(season);
                setSeason(initialState);
                setError(null);
            }
        }
    }

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
                <button onClick={submitSeason} >Add</button>
            </div>
            {error && (<span style={errorStyle} className="errorMessage">{error.length > 0 ? error : ''}</span>)}
        </div>
	)
}

const errorStyle = {
    paddingTop: "15px",
	textShadow: "10px 10px 10px",
    color: "red"
}

function validateSeason(season) {

    const schema = {
        name: Joi.string().min(5).max(50).required(),
        begin: Joi.date().required(),
        end: Joi.date().required()
    };

    return Joi.validate(season, schema);
}

export default AddSeason;