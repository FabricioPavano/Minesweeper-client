import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { withRouter } from 'react-router-dom'
import '../styles/GameForm.css';


class NewGameForm extends Component {


	constructor(props) {
	  super(props);
	  this.state = {
	    cols: 10,
	    rows: 10,
	    mines:10
	  };

	  this.handleInputChange = this.handleInputChange.bind(this);
	}

	handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

	createNewGame = () => {

		console.log('Starting New Game...');

		const options =  {
		  method: 'post',
		  headers:  {
	      "Content-Type": "application/json",
	      "Accept": "application/json"
   		},
   		body: JSON.stringify(this.state)
   	}

		fetch('http://localhost:3000/games', options).then( (response) => {
		  return response.json();
		})
		.then( (data) => {
		  this.props.history.push('/play/' + data.uuid)
		});

	}

	render(){
		return (
			<div className="game-form">
			  <div className="form-label">
			  	Rows
			  </div>

			  <div className="input-wrapper">
			  	<input
			  		name="rows"
			  	  type="text"
			  	  value={ this.state.rows }
			  	  onChange={this.handleInputChange}
			  	/>
			  </div>

			  <div className="form-label">
			  	Columns
			  </div>

			  <div className="input-wrapper">
			  	<input
			  		name="cols"
			  	  type="text"
			  	  value={ this.state.cols }
			  	  onChange={this.handleInputChange}
			  	/>
			  </div>


			  <div className="form-label">
			  	Mines
			  </div>

			  <div className="input-wrapper">
			  	<input
			  		name="mines"
			  	  type="text"
			  	  value={ this.state.mines }
			  	  onChange={this.handleInputChange}
			  	/>
			  </div>
			  <br />

			  <div className="form-label start-game">
			  	<a onClick={ () => this.createNewGame() }> Start! </a>
			  </div>
			</div>
		)
	}

}

export default withRouter(NewGameForm);