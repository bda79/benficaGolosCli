import React, { useState, useEffect, Fragment } from "react";
import AddTeam from "../teamComponents/addTeam";
import EditTeam from "../teamComponents/editTeam";
import TeamTable from "../teamComponents/teamTable";
import ServiceData from "../../../service/dataUtils";
import Storage from "../../../service/StorageData";


const Team = () => {
	console.log("Team ->");
    const [ error, setError ] = useState(null);
    const [ teams, setTeams ] = useState([]);
    const [ currentTeam, setCurrentTeam ] = useState({ _id: '', name: '', sigla: '', logo: ''});
    const [ editing, setEditing ] = useState(false);

    useEffect(() => {
        const token = Storage.get('token');
        if (token) {
            loadTeam(token)
            .then((data) => {
                if (data.data) {
                    setTeams(data.data);
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

    }, [currentTeam]);

    //Crud operations
    const _addTeam = async (team) => {
		const {error, data} = await addTeamInBD(team);
		if (data) {
			setTeams([ ...teams, data ]);
			setError(null); 
		}
		if (error) {
			setError(error);
		}
    }

    const addTeamInBD = async (team) => {
		return await saveTeamBD(team);
	}

    const deleteTeam = async (id) => {
		setEditing(false);
		
		const {error, data} = await deleteTeamBD(id);
		if (data) {
			const bdTeam = data;
			setTeams(teams.filter(team => team._id !== bdTeam._id));
			setError(null);
		}
		if (error) {
			setError(error);
		}
		
    }
    
    const updateTeam = async (id, updatedTeam) => {
		const toUpdate = teams.find((team) => team._id === id);
		if (toUpdate) {
			const {data, error} = await saveTeamBD(updatedTeam);
			if (data) {
				let bdTeam = data;
				setEditing(false);
				setTeams(teams.map(team => (team._id === bdTeam._id ? bdTeam : team)));
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
    
    const editRow = team => {
		setEditing(true);

		setCurrentTeam({ _id: team._id, name: team.name, sigla: team.sigla, logo: team.logo });
    }


    return display(error, editing, teams, setEditing, currentTeam, updateTeam, _addTeam, editRow, deleteTeam);
}

function display(error, editing, teams, setEditing, currentTeam, updateTeam, _addTeam, editRow, deleteTeam) {
    return (
        <div className="main">
            <div className="flex-container">
                <div className="column">
                    {editing ? (
                        <Fragment>
                            <h2>Edit Team</h2>
                            <EditTeam
                                editing={editing}
                                setEditing={setEditing}
                                currentTeam={currentTeam}
                                updateTeam={updateTeam}
                            />
                        </Fragment>
                    ) : (
                        <Fragment>
                            <h2>Add Team</h2>
                            <AddTeam addTeam={_addTeam} />
                        </Fragment>
                    )}
                </div>
                <div className="column">
                    <h2>View teams</h2>
                    <TeamTable teams={teams} editRow={editRow} deleteTeam={deleteTeam} />
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

const loadTeam = async (token) => {
	const headers = ServiceData.headers(token);
    const options = ServiceData.options('GET', null, headers);
    return await ServiceData.execute('teams', options);
}

const saveTeamBD = async (team) => {
	let result = {};
	const token = Storage.get('token');
	let path = `teams/${team._id}`;
	let method = 'PUT'
	if (!team._id) {
		path = "teams";
		method = "POST";
	}
	
	let formData = new FormData();
		if (team._id) {
			formData.append('_id', team._id);
		}
		formData.append('logo', team.logo);
		formData.append('name', team.name);
		formData.append('sigla', team.sigla);

	console.log("-->", team);
	const headers = ServiceData.headers(token, true);
	const options = ServiceData.options(method, formData, headers);
	
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
			console.log("GetTeam Error: ", err);
			result.error = err.response.data;
		});
	
	return result;
}

const deleteTeamBD = async (id) => {
	let result = {};
	const token = Storage.get('token');
	const path = `teams/${id}`;

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
			console.log("GetTeam Error: ", err);
			result.error = err.response.data;
		});
	
	return result;
}

export default Team;