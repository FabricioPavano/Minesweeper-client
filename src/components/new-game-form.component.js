import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { withRouter } from 'react-router-dom'
import API from '../services/api'
import SimpleReactValidator from 'simple-react-validator';
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
	  this.createNewGame     = this.createNewGame.bind(this);

	  this.validator = new SimpleReactValidator({

	  	  // Validates the amount of mines is not superior to the amount of boxes
	      validators: {
	        mine_limit: {
	          message: 'The amount of mines is too high',
	          rule: (val, params, validator) => {
	          	return false
	          },
	          required: true  // optional
	        }
	      }
	    });

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



		if (this.validator.allValid()) {

			API.create_new_game(this.state)
				.then( (data) => {
				  this.props.history.push('/play/' + data.uuid)
				});
		}
		else {
		  this.validator.showMessages();
		  this.forceUpdate();
		}

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

			  { this.validator.message('rows', this.state.rows, 'required|numeric|min:3,num|max:50,num') }

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

			  { this.validator.message('cols', this.state.cols, 'required|numeric|min:3,num|max:50,num') }

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


			  { this.validator.message('mines', this.state.mines, 'required|numeric|min:3,num|max:' + (this.state.cols * this.state.rows - 1) + ',num') }

			  <br />

			  <div className="form-label start-game">
			  	<a onClick={ () => this.createNewGame() }> Start! </a>
			  </div>
			</div>
		)
	}

}

export default withRouter(NewGameForm);