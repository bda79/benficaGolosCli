import React, { useState} from 'react';
import Joi from 'joi';

const errorStyle = {
    paddingTop: "15px",
	textShadow: "10px 10px 10px",
    color: "red"
}

const AddChampionship = (props) => {
    const initialState = { _id: null, name: ''};
    const [ championship, setChampionship ] = useState(initialState);
    const [ error, setError ] = useState(null);

    const handleInputChange = event => {
        const { name, value } = event.target;
        
		setChampionship({ ...championship, [name]: value });
    }

    const submitChampionship = () => {
        if (!championship.name ) {
            setError("Error: Fill name.");
        } 
        else {
            const { error } = validateChampionship(championship);
            if (error) {
                setError(error.details[0].message);
            }
            else {
                props.addChampionship(championship);
                setChampionship(initialState);
            }
        }
    }

    return (
        <div className="form">
            <div className="form-group" >
                <label htmlFor="name">Name</label>
                <input type="text" name="name" value={championship ? championship.name : ''} onChange={handleInputChange}/>
            </div>
            <div className="button-joiner">
                <button onClick={submitChampionship} >Add</button>
            </div>
            {error && (<span style={errorStyle} className="errorMessage">{error.length > 0 ? error : ''}</span>)}
        </div>
	)
}

function validateChampionship(championship) {

    const schema = {
        name: Joi.string().min(5).max(50).required()
    };

    return Joi.validate(championship, schema);
}

export default AddChampionship;