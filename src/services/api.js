class API{
	
	static buildHeaders(){
		

		// return authHeaders;
	}

	static fetch_user_games(){

		var authHeaders = new Headers();
		authHeaders.append("Authorization", "Bearer " + localStorage['minesweeper-token']);

		var requestOptions = {
		  method: 'GET',
		  headers: authHeaders,
		  redirect: 'follow'
		};

		return fetch( process.env.REACT_APP_BACKEND_URL + "/games", requestOptions)
		  .then(response => response.json())
		  .catch(error => console.log('error', error));

	}

	static create_new_game(data){

		var myHeaders = new Headers();
		myHeaders.append("Authorization", "Bearer " + localStorage['minesweeper-token']);

		myHeaders.append("Content-Type", "application/json")
		myHeaders.append("Accept", "application/json")


		const options =  {
		  method: 'post',
		  headers: myHeaders,
   		body: JSON.stringify({ game: data })
   	}

		return fetch( process.env.REACT_APP_BACKEND_URL + '/games', options).then( (response) => {
		  return response.json();
		})

	}


	static get_game_info(uuid){

		var myHeaders = new Headers();
		myHeaders.append("Authorization", "Bearer " + localStorage['minesweeper-token']);

		var requestOptions = {
		  method: 'GET',
		  headers: myHeaders,
		  redirect: 'follow'
		};

		return fetch( process.env.REACT_APP_BACKEND_URL + '/games/' + uuid, requestOptions)
			.then( (response) => {
			  return response.json();
			})
			.catch(error => console.log('error', error));
	}

	static save_game(game_state, boxes_state_array){

		var myHeaders = new Headers();
		myHeaders.append("Authorization", "Bearer " + localStorage['minesweeper-token']);

		myHeaders.append("Content-Type", "application/json")
		myHeaders.append("Accept", "application/json")


		const options =  {
		  method: 'PUT',
		  headers: myHeaders,
   		body: JSON.stringify({game: game_state, state: boxes_state_array})
   	}

		return fetch(process.env.REACT_APP_BACKEND_URL + '/games/' + game_state.uuid, options).then( (response) => {
		  return response.json();
		})
	}

}


export default API;