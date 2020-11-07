import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import '../styles/GameForm.css';


class NewGameForm extends Component {

	createNewGame = () => {

	}

	render(){
		return (
			<div className="game-form">
			  <div className="form-label">
			  	Rows
			  </div>

			  <div className="input-wrapper">
			  	<input type="text"></input>
			  </div>

			  <div className="form-label">
			  	Columns
			  </div>

			  <div className="input-wrapper">
			  	<input type="text"></input>
			  </div>


			  <div className="form-label">
			  	Mines
			  </div>

			  <div className="input-wrapper">
			  	<input type="text"></input>
			  </div>
			  <br />

			  <div className="form-label">
			  	<a onClick={ () => this.createNewGame() }> Start! </a>
			  </div>
			</div>
		)
	}
	

}

export default NewGameForm;