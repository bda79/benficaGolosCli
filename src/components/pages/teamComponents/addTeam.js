import React, { useState } from 'react';
import { ImageUtils } from '../../../service/utils';
import Joi from 'joi';

const errorStyle = {
    paddingTop: "15px",
	textShadow: "10px 10px 10px",
    color: "red"
}

const AddTeam = props => {
    const initialState = { _id: null, name: '', sigla: '', logo: null };
    const [ team, setTeam ] = useState(initialState);
    const [ img, setImg] = useState({img: null, imgUrl: null});
    const [ error, setError ] = useState(null);
    let fileInput = React.createRef();

    const setFileInputRef = el => {
        fileInput = el;
    }

    const handleInputChange = event => {
        const { name, value } = event.target;
        
		setTeam({ ...team, [name]: value });
    }

    const handleImage = event => {
        event.preventDefault();
        
        let reader = new FileReader();
        let img = event.target.files[0];
        
        const error = ImageUtils.validateImage(img);
        if (error) {
            setError(error);
            fileInput.value = null;
            return;
        }

        reader.onload = () => {
            setImg({img: img, imgUrl: reader.result});
            let t = team;
            t.logo = img;
            setTeam(t);
        }

        reader.readAsDataURL(img);
    }

    const submitTeam = () => {
        if (!team.name || !team.sigla || !team.logo) {
            setError("Error: Fill all fields.");
        } 
        else {
            const { error } = validateTeam(team, img);
            if (error) {
                setError(error.details[0].message);
            }
            else {
                props.addTeam(team);
                setTeam(initialState);
                fileInput.value = null;
                setImg({img: null, imgUrl: null});
            }
        }
    }

    return (
        <div className="form">
            <div className="form-group" >
                <label htmlFor="name">Name</label>
                <input type="text" name="name" value={team ? team.name : ''} onChange={handleInputChange}/>
            </div>
            <div className="form-group" >
                <label htmlFor="sigla">Sigla</label>
                <input type="text" name="sigla" value={team? team.sigla: ''} onChange={handleInputChange}/>
            </div>
            <div className="form-group">
                <label htmlFor="logo">Logo</label>
                <input className="imageInput" type="file" onChange={(e)=> handleImage(e)} ref={setFileInputRef}/>
                <div className="image">
                    <button className="imageBtn" onClick={()=>fileInput.click()}>Image</button>
                    <div className="imagePreview">
                        {img.imgUrl && ( <img src={img.imgUrl} alt=""/> )}
                    </div>
                </div>
            </div>
            <div className="button-joiner">
                <button onClick={submitTeam} >Add</button>
            </div>
            {error && (<span style={errorStyle} className="errorMessage">{error.length > 0 ? error : ''}</span>)}
        </div>
	)
}

function validateTeam(team, img) {
    const {name} = img.img;
    const t = {
        name: team.name,
        sigla: team.sigla,
        logo: name
    }

    console.log("validateTeam", t, img.img);
    

    const schema = {
        name: Joi.string().min(5).max(50).required(),
        sigla: Joi.string().min(3).max(5).required(),
        logo: Joi.string()
    };

    return Joi.validate(t, schema);
}

export default AddTeam;