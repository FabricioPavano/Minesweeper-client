import React, { Component } from 'react';


// This component represents each of the boxes inside a game
class Box extends Component {

	constructor(props) {
	  super(props);

	  this.renderNumberOfAdjacentMines = this.renderNumberOfAdjacentMines.bind(this)

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
			<div onClick={ () => this.props.manuallyUncoverBox(this.props.row, this.props.col, this.props.has_mine, this.props.adjacent) } 
			     onContextMenu= { (e) => { this.props.handleRightClick(e, this.props.row, this.props.col) } }
			     data-color={ 'color-' + this.props.adjacent } 
			     className={'box ' + this.props.status} >
				{ this.renderNumberOfAdjacentMines() }
			</div>
		)
	}

}

export default Box;