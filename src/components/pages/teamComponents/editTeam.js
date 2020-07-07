import React, { useState, useEffect } from 'react';
import { ImageUtils } from '../../../service/utils';

const errorStyle = {
    paddingTop: "15px",
	textShadow: "10px 10px 10px",
    color: "red"
}

const EditTeam = props => {
    const [ readMode, setReadMode ] = useState(true);
    const [ team, setTeam ] = useState(props.currentTeam);
    const [ img, setImg] = useState({img: null, imgUrl: null});
    const [ error, setError ] = useState(null);

    let fileInput = React.createRef();

    useEffect(
        () => {
            setTeam(props.currentTeam);
        }, 
        [props]
    );

    const setFileInputRef = el => {
        fileInput = el;
    }

    const handleEdit = () => {
        props.setEditing(false);
        setImg({img: null, imgUrl: null});
        setReadMode(true);
    }

    const handleInputChange = e => {
        const {name, value } = e.target;

        setTeam({ ...team, [name]: value });
    }

    const handleUpdate = () => {
        setReadMode(true);
        setImg({img: null, imgUrl: null});
        props.updateTeam(team);
    }

    const handleImage = event => {
        event.preventDefault();
        setReadMode(false);
        
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
                        {readMode && ( <img src={ImageUtils.getImage(team.logo) } alt=""/> )}
                        {img.imgUrl && ( <img src={img.imgUrl} alt=""/> )}
                    </div>
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

export default EditTeam;