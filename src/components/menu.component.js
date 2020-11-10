import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";


class Menu extends Component {


	constructor(props){
	  super(props);
	  this.state = {
	  	savedGames: []
	  };

	  fetch('http://localhost:3000/games/')
	  	.then((response) => {
	  		return response.json();
  		})
  		.then( (data) => {
  			this.setState({ savedGames: data.result})
  		});
	}

	// Some quick and dirty date formatting to make the saved game items
	// look a bit better
	formatDate(date){
		let d = new Date(date)
		return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
	}

	render(){
		return (
			<div className="App">
			  <header className="App-header">
			    <h2> Minesweeper </h2>
			  </header>

			  <Link to="/new"><h2> New Game </h2></Link>

			  <header className="App-header">
			    <h3> Saved Games </h3>
			  </header>

			  { this.state.savedGames.map( (saved_game, index) => {

			  	return <Link key={saved_game.created_at} to={"/play/" + saved_game.uuid}><h2> { this.formatDate(saved_game.updated_at) } </h2></Link>

			  })}



			</div>
		)
	}

}

export default Menu;