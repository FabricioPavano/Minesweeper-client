// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { withRouter } from 'react-router-dom'
import YAML from 'yaml'

// Components
import Box from './box.component.js';

// Services
import API from '../services/api'

// Images
import save_game_icon from '../save-icon.jpeg';

// Styles
import '../styles/MineSweeper.css';


class Minesweeper extends Component {

	constructor(props) {
	  super(props);

	  this.discoverNearByMines          = this.discoverNearByMines.bind(this)
	  this.changeStatusOfBox            = this.changeStatusOfBox.bind(this)
	  this.manuallyUncoverBox           = this.manuallyUncoverBox.bind(this)
	  this.programaticallyUncoverBoxes  = this.programaticallyUncoverBoxes.bind(this)

	  this.endGame                      = this.endGame.bind(this)
	  this.retry                        = this.retry.bind(this)
	  this.handleRightClick             = this.handleRightClick.bind(this)

	  this.state = {
	  	game: {
	  		used_flags: 0,
	  		mines_flagged: 0
	  	},
	  	boxes: [],

	  };

	}


	componentDidMount(){
		const uuid = this.props.match.params.uuid


		API.get_game_info(uuid)
			.then( (data) => {

				let state_array = data.state

				let state_hash = this.transformStateArrayToHash(state_array)

				this.setState({
					game: Object.assign(this.state.game, data),
					boxes: state_hash
				})

				this.props.renderGameInformation(Object.assign(this.state.game, data))

			})

	}

	// This method makes sure the box goes from
	// 'covered' to 'flagged' to 'question' to 'covered' again and so on
	handleRightClick(e, row, col){
		e.preventDefault();

		if(this.state.game.ended){
			return
		}

		let box = this.state.boxes[row + ':' + col]

		let used_flags = this.state.game.used_flags
		let total_mines = this.state.game.mines
		let mines_flagged = this.state.game.mines_flagged
		let has_mine = box.has_mine

		if(box.status == 'covered'){
			// Does not allow to add more flags than mines on the game
			if(used_flags == total_mines){
				return
			} else {

				// check if box has a mine in it
				if(has_mine){

					// Check if user won the game
					if(mines_flagged == total_mines - 1){
						this.endGame()
					}

					this.setState({ game: Object.assign(this.state.game, { mines_flagged: mines_flagged + 1})})

				}

				this.changeStatusOfBox(row,col,'flagged')
				this.setState({ game: Object.assign(this.state.game, { used_flags: used_flags + 1})})

			}
		}

		if(box.status == 'flagged'){
			this.changeStatusOfBox(row,col,'question')
		}

		if(box.status == 'question'){
			this.changeStatusOfBox(row,col,'covered')
			this.setState({ game: Object.assign(this.state.game, { used_flags: used_flags - 1})})
		}

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


	// This algorithm gets triggered when an empty box is clicked
	// it looks recursively on adjacent boxes until it finds a box
	// with a number on it
	// This method stores the boxes already explored in an array
	// in order to avoid an infinite loop of exploring
	discoverNearByMines(central_box, explored_boxes){

		// Check if this box has been explored already
		// if it is stop execution (avoids infinite loops)

		var item_found = explored_boxes.find(box => box.row == central_box.row && box.col == central_box.col);

		if(typeof item_found != "undefined"){
			return
		}
		else{
			explored_boxes.push(central_box)
		}

		// Gets all adjacent boxes

	  // This array contains how many rows and columns should we move left or right
		// in order to find all 8 adjacent boxes
		var deltas_array = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]

		var adjacent_boxes = deltas_array.map( (delta_array) => {

			let next_box_row = central_box.row + delta_array[0]
			let next_box_col = central_box.col + delta_array[1]
			let next_box_key = next_box_row + ':' + next_box_col

			return this.state.boxes[next_box_key]
		})

		// Once the algorithm reaches the edges it some of these boxes
		// will be undefined, filter them

		adjacent_boxes = adjacent_boxes.filter( (box) => typeof box != "undefined")

		this.programaticallyUncoverBoxes(adjacent_boxes);

		// now we run the same algorithm recursively, but only for the boxes
		// with adjacent value = 0

		var next_boxes = adjacent_boxes.filter( (box) => box.adjacent == 0 )

		next_boxes.forEach( (box) => {
			this.discoverNearByMines(box, explored_boxes)
		})

	}

	// function in charge of actually changing the state of a specific box
	changeStatusOfBox(row, col, status){

		this.setState((prevState) => {

			var newBoxes = prevState.boxes

			let hash_key = row + ':' + col

			newBoxes[hash_key] = Object.assign(newBoxes[hash_key], { status: status })

			return { ...prevState, boxes: newBoxes }

		})
	}

	manuallyUncoverBox(row, col, has_mine, adjacent){


		

		let hash_key = row + ':' + col

		console.log('check box', this.state.boxes[hash_key])

		if(this.state.boxes[hash_key].status != 'covered')
			return

		// Does not allow you to continue playing if game has ended
		if(this.state.game.ended){
			return
		}

		// runs recursive method that searches boxes with numbers on it nearby
		if(adjacent == 0){
			this.discoverNearByMines({row: row, col: col, adjacent: 0}, [])
		}

		// Checks if there's a mine in the box
		if(has_mine){
			this.changeStatusOfBox(row, col, 'uncovered mine')
			this.endGame()
		}
		else{
			// Updates state on this particular box
			this.changeStatusOfBox(row, col, 'uncovered')
		}


	}

	// This uncover method differs from the one implemented in the box component
	// Because this one is only called by the discovery algorithm
	// whereas the other one is only called when the user clicks on the box
	programaticallyUncoverBoxes(boxes){

		this.setState((prevState) => {

			var newBoxes = prevState.boxes

			// Applies the changes for each item of the array
			// Notice setState is called only once for maximum performance
			boxes.forEach( box => {

				let row = box.row
				let col = box.col
				let hash_key = row + ':' + col


				if(newBoxes[hash_key]['status'] == 'covered' ){
					newBoxes[hash_key] = Object.assign(newBoxes[hash_key], { status: 'uncovered' })
				}

			})

			return { ...prevState, boxes: newBoxes }

		})

	}



	

	// Loads initial version of the game saved on local storage
	retry(){

		let initail_state = JSON.parse(localStorage.getItem('initial-' + this.state.game.uuid))

		this.setState( { boxes: initail_state,
										 game: Object.assign(this.state.game, {ended:false}) }
										 , () => console.log(this.state))

	}

	endGame(){
		this.setState({ game: Object.assign(this.state.game, {ended:true} )})
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
			          manuallyUncoverBox={ this.manuallyUncoverBox }
			          handleRightClick={ this.handleRightClick }
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

				<div className='used-flags'> Used Flags: {this.state.game.used_flags} / {this.state.game.mines} </div>

				

				<div className="minesweeper-container">
						{ rows.map( (row, index) => {

							let key = 'row' + index
							return <div key={key}  className={'row'}> {row} </div>
						})}
				</div>

				{ this.state.game && this.state.game.ended && (

					<React.Fragment>
						<br />

						{ this.state.game.mines_flagged == this.state.game.mines &&
							<div className='options'> Congratulations! </div>
						}

						{ this.state.game.mines_flagged < this.state.game.mines &&
							<div className='options'> Game over! </div>
						}

						<br />

						<br />
						<div className='option-item'> <Link to="/menu"> -exit- </Link></div>
					</React.Fragment>

				)}

				{ (this.state.game && !this.state.game.ended) &&
					<React.Fragment>
						<br />
						<br />
						<br />
						<br />
						<div className='option-item' onClick={ () => this.props.saveGame(this.state.boxes, this.state.game) } > -save- </div>
						<br />
						<div className='option-item'> <Link to="/menu"> -exit- </Link></div>
					</React.Fragment>
				}
			</React.Fragment>

		)
	}

}





class MinesweeperContainer extends Component {

	constructor(props) {
	  super(props);

	  this.saveGame              = this.saveGame.bind(this)
	  this.renderGameInformation = this.renderGameInformation.bind(this)

	  this.state = { game: {} }
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

	renderGameInformation(game){

		this.setState( { game: game }, () => { 

			let intervalId = setInterval(() => {
				this.setState( { game: Object.assign( game, { time_ellapsed: this.state.game.time_ellapsed  + 1 })})
			}, 1000)

		})

	}

	saveGame(boxes_hash, game_state){

		let boxes_state_array = this.transformStateHashToArray(boxes_hash)

		API.save_game(game_state, boxes_state_array)
			.then( (data) => {
				this.props.history.push('/menu')
			});

	}

	renderTime(){
		var time = new Date(this.state.game.time_ellapsed * 1000).toISOString().substr(11, 8);
		return time;
	}

	render() {
		return (
			<React.Fragment>
				<div className='time-ellapsed'>
					{ this.state.game && typeof this.state.game.time_ellapsed != 'undefined' &&
						this.renderTime()
					}
				</div>
				<Minesweeper {...this.props}
		          saveGame={ this.saveGame }
		          renderGameInformation={ this.renderGameInformation } />
		  </React.Fragment>
		)
	}
}





export default withRouter(MinesweeperContainer);