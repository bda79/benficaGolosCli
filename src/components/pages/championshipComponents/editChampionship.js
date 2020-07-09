import React, { useState, useEffect } from 'react';

const EditChampionship = (props) => {
    const [ championship, setChampionship ] = useState(props.currentChampionship);

    useEffect(
        () => {
            setChampionship(props.currentChampionship);
        }, 
        [props]
    );

    const handleEdit = () => {
        props.setEditing(false);
    }

    const handleInputChange = e => {
        const {name, value } = e.target;

        setChampionship({ ...championship, [name]: value });
    }

    const handleUpdate = () => {
        props.updateChampionship(championship._id, championship);
    }

    return (
        <div className="form">
            <div className="form-group" >
                <label htmlFor="name">Name</label>
                <input type="text" name="name" value={championship ? championship.name : ''} onChange={handleInputChange}/>
            </div>
            <div className="button-joiner">
                <button onClick={handleUpdate} >Update</button>
                <button onClick={handleEdit} className="button muted-button">Cancel</button>
            </div>
        </div>
    );
}

export default EditChampionship;