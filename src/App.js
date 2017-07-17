import React, { Component } from 'react';
import './App.css';
import SetDifficulty from './SetDifficulty';
import Game from './Game';

class App extends Component {
	constructor(props){
		super(props);
		this.state = {
			difficulty : "",
			difficulties : [{easy : "łatwy"}, {medium : "normalny"}, {hard : "trudny"}],
			settingDifficulty : true
		}
		this.setDifficultyInState = this.setDifficultyInState.bind(this);
	}

	//funkcja do przekazania w dol - ustawia tu state, a ten jest nastepnie przekazywany w dol do komponentu z gra
	setDifficultyInState = (chosenDifficulty) => {
		console.log(this.state.difficulty)
		this.setState({
			difficulty : chosenDifficulty,
			settingDifficulty : false
		})
		console.log(this.state.difficulty)
	}

	render() {
		//jesli wybierany jest poziom trudnosci
		if (this.state.settingDifficulty){
			return (
			//komponent ustawiajacy difficulty
			<SetDifficulty setDefficultyInParent = { this.setDifficultyInState } availableDifficulties = { this.state.difficulties }/>
			) 
		} else {
			return (
			//koponent z gra
			<Game difficulty = { this.state.difficulty }/>
			)	
		}
	}
}

export default App;
