import React, { Component } from 'react';
import Box from './box.component.js';

import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { withRouter } from 'react-router-dom'
import YAML from 'yaml'

import '../styles/MineSweeper.css';


class Minesweeper extends Component {

	constructor(props) {
	  super(props);

	  this.updateState  = this.updateState.bind(this)
	  this.saveGame     = this.saveGame.bind(this)
	  this.endGame      = this.endGame.bind(this)
	  this.retry        = this.retry.bind(this)

	  this.state = {
	  	game: {},
	  	boxes: []
	  };

	}

	

	componentDidMount(){
		const uuid = this.props.match.params.uuid

		fetch('http://localhost:3000/games/' + uuid)
		.then( (response) => {
		  return response.json();
		})
		.then( (data) => {


			let state_array = data.state

			let state_hash = this.transformStateArrayToHash(state_array)

			// saves two copies of the state on local storage
			// One for in-changes updates (allows to save the game at any moment)
			localStorage.setItem(data.uuid, JSON.stringify(state_hash))

			// An initial version (allows retries)
			localStorage.setItem('initial-' + data.uuid, JSON.stringify(state_hash))

			this.setState({
				game: data,
				boxes: state_hash
			})

		})

	}

	shouldComponentUpdate(prevProps, prevState){

		return true
	}


	// Boxes information come in an Array
	// For faster lookups - this script stores the info in an object
	// Which acts like a Hash - providing O(1) lookups
	transformStateArrayToHash(state_array){
		let boxes_hash = {}
		for (const box of state_array) {
			boxes_hash[box.row + ':' + box.col] = box
		}
		return boxes_hash;
	}


	// In order to send the state back to the backend
	// We transform the state back to an array
	transformStateHashToArray(state_hash){
		let state_array = []
		for (const property in state_hash) {
			// We don't mind keeping the order of the boxes
			state_array.push(state_hash[property])
		}
		return state_array;
	}


	saveGame(){

		return
		// Proof of concept, I want to make sure I can change state and succesfully
		// send it to the server, have it saved there.
		// Then load it again
		// A full cycle

		let gameState = this.state.game.state;

		gameState[13]['status'] = 'uncovered'

		this.setState(Object.assign({ game: {state: gameState }}, this.state), () => {

			let yaml_state = YAML.stringify(gameState)

			const options =  {
			  method: 'PUT',
			  headers:  {
		      "Content-Type": "application/json",
		      "Accept": "application/json"
	   		},
	   		body: JSON.stringify(this.state.game)
	   	}

			fetch('http://localhost:3000/games/' + this.state.game.uuid, options).then( (response) => {
			  return response.json();
			})
			.then( (data) => {
			  this.setState({ game: data });
			});

		})

	}

	// Loads initial version of the game saved on local storage
	retry(){
		
		console.log('called!')

		let initail_state = JSON.parse(localStorage.getItem('initial-' + this.state.game.uuid))

		console.log('is', initail_state)
		this.setState( { boxes: initail_state,
										 game: Object.assign(this.state.game, {ended:false}) }
										 , () => console.log(this.state))

	}

	// Updates the state of the game as the game progresses, on local storage
	// The state of the game is kept on a serialized javascript object

	// each affected box is is represented by an object:
	/*
	{
		row: n,
		col: m,
		new_status: x
	}
	*/

	// If the parameter receives is an array we apply multiple changes
	// to the state of the game sequentially

	// It can also receive a single object
	updateState(affectedBoxes){

		let state = JSON.parse(localStorage.getItem(this.state.game.uuid))

		// Applies the changes for each item of the array
		// Notice setState is called only once for maximum performance
		affectedBoxes.forEach( affectedBox => {

			let row = affectedBox.row
			let col = affectedBox.col
			let hash_key = row + ':' + col
			let new_status = affectedBox.new_status

			state = Object.assign(
				state,
				{ [hash_key]: { ...state[hash_key], status: new_status } }
			)
		})

		// saves the state on local storage
		localStorage.setItem(this.state.game.uuid, JSON.stringify(state))

	}




	endGame(){
		this.setState({ game: Object.assign(this.state.game, {ended:true} )}, () => {
			console.log(this.state)
		})

	}

	renderRow(row_number){
		let total_columns = this.state.game.cols
		let row_objects       = []

		let i;
		for (i = 1; i <= total_columns; i++) {
		  row_objects.push(this.state.boxes[row_number + ":" + i])
		}

		// maps it to JSX elements
		return row_objects.map( (box) => {
			let key = box.row + ':' + box.col
			return <Box
			          key={key}
			          row={box.row}
			          col={box.col}
			          status={box.status}
			          has_mine={ box.has_mine }
			          adjacent={ box.adjacent }
			          game_ended={ this.state.game.ended }
			          updateState={ this.updateState }
			          endGame={ this.endGame }
			        />
		})


	}

	// Shallow comparison of objects
	// is enough for our purposes
	objectsEqual(object1, object2){
	  const keys1 = Object.keys(object1);
	  const keys2 = Object.keys(object2);

	  if (keys1.length !== keys2.length) {
	    return false;
	  }

	  for (let key of keys1) {
	    if (object1[key] !== object2[key]) {
	      return false;
	    }
	  }

  	return true;
	}

	arraysEqual(a, b) {
	  if (a === b) return true;
	  if (a == null || b == null) return false;
	  if (a.length !== b.length) return false;

	  // If you don't care about the order of the elements inside
	  // the array, you should sort both arrays here.
	  // Please note that calling sort on an array will modify that array.
	  // you might want to clone your array first.

	  for (var i = 0; i < a.length; ++i) {
	    if (a[i] !== b[i]) return false;
	  }
	  return true;
	}


	render(){

		// Stores JSX boxes inside:
		var rows = [];

		var total_rows = this.state.game.rows;

		var current_row;
		for (current_row = 1; current_row <= total_rows; current_row++) {
		  rows.push(this.renderRow(current_row))
		}

		return (
			<React.Fragment>
				<div className="minesweeper-container">
						{ rows.map( (row, index) => {

							let key = 'row' + index
							return <div key={key}  className={'row'}> {row} </div>
						})}
				</div>

				{ this.state.game && this.state.game.ended && (

					<React.Fragment>
						<br />
						<div className='game-over'> Game Over! </div>

						<br />
						<br />
						<div className='game-over-item' onClick={ this.retry } > -retry- </div>
						<br />
						<div className='game-over-item'> <Link to="/"> -exit- </Link></div>

					</React.Fragment>

				)}
			</React.Fragment>

		)
	}

}

export default withRouter(Minesweeper);