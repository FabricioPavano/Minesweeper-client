import React, { Component } from 'react';


// This component represents each of the boxes inside a game
class Box extends Component {

	constructor(props) {
	  super(props);

	  this.renderNumberOfAdjacentMines = this.renderNumberOfAdjacentMines.bind(this)
	  this.uncoverBox                  = this.uncoverBox.bind(this)

	}




	uncoverBox(){

		// Does not allow you to continue playing if game has ended
		if(this.props.game_ended){
			return
		}

		// runs recursive method that searches boxes with numbers on it nearby
		if(this.props.adjacent == 0){
			this.props.discoverNearByMines({row: this.props.row, col: this.props.col, adjacent: 0})
		}

		this.props.updateLocalStorageState([{
			row: this.props.row,
			col: this.props.col,
			new_status: 'uncovered'
		}])

		// Checks if there's a mine in the box
		if(this.props.has_mine){
			this.setState({ status: 'uncovered mine'})
			this.props.endGame()
		}
		else{
			// Updates state on this particular box
			this.setState({ status: 'uncovered'})
		}

	}

	componentDidUpdate(prevProps, prevState) {
	}

	// Renders number of adjacent mines unless is 0
	renderNumberOfAdjacentMines(){
		if(this.props.status == 'uncovered' && this.props.adjacent != 0){
			return this.props.adjacent
		}
		else{
			return null;
		}

	}

	render(){

		return (
			<div onClick={ () => this.props.manuallyUncoverBox(this.props.row, this.props.col, this.props.has_mine, this.props.adjacent) } data-color={ 'color-' + this.props.adjacent } className={'box ' + this.props.status} >
				{ this.renderNumberOfAdjacentMines() }
			</div>
		)
	}

}

export default Box;