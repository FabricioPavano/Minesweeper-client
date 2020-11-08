import React, { Component } from 'react';


// This component represents each of the boxes inside a game
class Box extends Component {

	constructor(props) {
	  super(props);

	  this.uncoverBox  = this.uncoverBox.bind(this)

	  this.state = {
	  	status: this.props.status,
	  	value: ''
	  };
	}

	uncoverBox(){

		// Checks if there's a mine in the box

		if(this.props.has_mine){
			this.setState({ status: 'uncovered mine'})
		}
		else{
			this.setState({ status: 'uncovered', value: this.props.adjacent })
		}

	}

	render(){
		return (
			<div onClick={ this.uncoverBox } data-color={ 'color-' + this.props.adjacent } className={'box ' + this.state.status} >
				{ this.state.value }
			</div>
		)
	}

}

export default Box;