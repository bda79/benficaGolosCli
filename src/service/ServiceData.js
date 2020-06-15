export function ServiceData(type, method, data) {
    let baseUrl = 'http://localhost:5000/api/';
    console.log('assdddd');

    return new Promise((resolve, reject) =>{
        fetch(baseUrl + type, {
            method: method,
            body: JSON.stringify(data)
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            resolve(responseJson);
        })
        .catch((error) => {
            console.log(error);
            resolve(error);
        })
    });
}