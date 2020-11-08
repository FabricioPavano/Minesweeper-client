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

	  this.saveGame  = this.saveGame.bind(this)

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

			// Look out this fancy deconstruction
			// let {boxes, ...game} = response

			let boxes = data.state


			let boxes_object = {}

			// // Boxes come in an Array
			// // For faster lookups - this script stores the info in an object
			// // Which acts like a Hash - providing O(1) lookups

			for (const box of boxes) {
				boxes_object[box.row + ':' + box.col] = box
			}

			this.setState({
				game: data,
				boxes: boxes_object
			}, () => { 	console.log(this.state); })

		})

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
			          status={box.status}
			          has_mine={ box.has_mine }
			          adjacent={ box.adjacent }
			        />
		})


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
			<div className="minesweeper-container">
					{ rows.map( (row, index) => {

						let key = 'row' + index
						return <div key={key}  className={'row'}> {row} </div>
					})}
			</div>
		)
	}

}

export default withRouter(Minesweeper);