import React, { useState, useEffect, Fragment } from "react";
import AddChampionship from "../championshipComponents/addChampionship";
import EditChampionship from "../championshipComponents/editChampionship";
import ChampionshipTable from "../championshipComponents/championshipTable";
import ServiceData from "../../../service/dataUtils";
import Storage from "../../../service/StorageData";

const Championship = () => {

    const [ error, setError ] = useState(null);
    const [ championships, setChampionship ] = useState([]);
    const [ currentChampionship, setCurrentChampionship ] = useState({ _id: '', name: ''});
    const [ editing, setEditing ] = useState(false);

    useEffect(() => {
        const token = Storage.get('token');
        if (token) {
            loadChampionship(token)
            .then((data) => {
                if (data.data) {
                    setChampionship(data.data);
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

    }, [currentChampionship]);

    //Crud operations
    const _addChampionship = async (championship) => {
		const {error, data} = await addChampionshipInBD(championship);
		if (data) {
			setChampionship([ ...championships, data ]);
			setError(null); 
		}
		if (error) {
			setError(error);
		}
    }

    const addChampionshipInBD = async (championship) => {
		return await saveChampionshipBD(championship);
	}

    const deleteChampionship = async (id) => {
		setEditing(false);
		
		const {error, data} = await deleteChampionshipBD(id);
		if (data) {
			const bdChampionship = data;
			setChampionship(championships.filter(championship => championships._id !== bdChampionship._id));
			setError(null);
		}
		if (error) {
			setError(error);
		}
		
    }
    
    const updateChampionship = async (id, updatedChampionship) => {
		const toUpdate = championships.find((championship) => championship._id === id);
		if (toUpdate) {
			const {data, error} = await saveChampionshipBD(updatedChampionship);
			if (data) {
				let bdChampionship = data;
				setEditing(false);
                setChampionship(championships.map(championship => (championship._id === bdChampionship._id ? 
                    bdChampionship : championship)));
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
    
    const editRow = championship => {
		setEditing(true);

		setCurrentChampionship({ _id: championship._id, name: championship.name });
    }


    return display(error, editing, championships, setEditing, currentChampionship, updateChampionship, _addChampionship, editRow, deleteChampionship);
}

function display(error, editing, championships, setEditing, currentChampionship, updateChampionship, _addChampionship, editRow, deleteChampionship) {
    return (
        <div className="main">
            <div className="flex-container">
                <div className="column">
                    {editing ? (
                        <Fragment>
                            <h2>Edit Championship</h2>
                            <EditChampionship
                                editing={editing}
                                setEditing={setEditing}
                                currentChampionship={currentChampionship}
                                updateChampionship={updateChampionship}
                            />
                        </Fragment>
                    ) : (
                        <Fragment>
                            <h2>Add Championship</h2>
                            <AddChampionship addChampionship={_addChampionship} />
                        </Fragment>
                    )}
                </div>
                <div className="column">
                    <h2>View Championship</h2>
                    <ChampionshipTable championships={championships} editRow={editRow} deleteChampionship={deleteChampionship} />
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

const loadChampionship = async (token) => {
	const headers = ServiceData.headers(token);
    const options = ServiceData.options('GET', null, headers);
    return await ServiceData.execute('championships', options);
}

const saveChampionshipBD = async (championship) => {
	let result = {};
	const token = Storage.get('token');
	let path = `championships/${championship._id}`;
	let method = 'PUT'
	if (!championship._id) {
		path = "championships";
		method = "POST";
	}
	

	console.log("-->", championship);
	const headers = ServiceData.headers(token, true);
	const options = ServiceData.options(method, championship, headers);
	
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
			console.log("GetChampionship Error: ", err);
			result.error = err.response.data;
		});
	
	return result;
}

const deleteChampionshipBD = async (id) => {
	let result = {};
	const token = Storage.get('token');
	const path = `championships/${id}`;

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
			console.log("GetChampionship Error: ", err);
			result.error = err.response.data;
		});
	
	return result;
}

export default Championship;