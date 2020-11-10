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

		return fetch("http://localhost:3000/games", requestOptions)
		  .then(response => response.json())
		  .catch(error => console.log('error', error));

	}

	static create_new_game(data){

		var myHeaders = new Headers();
		myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MDUxMjMwODUsInN1YiI6MX0.nkgG9MHoJ2M7IPBycqP35uOVkXpE_HQbv8F4ljFrWtI");

		// var authHeaders = new Headers();
		// authHeaders.append("Authorization", "Bearer " + localStorage['minesweeper-token']);
		myHeaders.append("Content-Type", "application/json")
		myHeaders.append("Accept", "application/json")

		// console.log('headers', authHeaders)

		console.log('here', JSON.stringify({ game: data }))


		const options =  {
		  method: 'post',
		  headers: myHeaders,
   		body: JSON.stringify({ game: data })
   	}

		return fetch('http://localhost:3000/games', options).then( (response) => {
		  return response.json();
		})



	}

}


export default API;