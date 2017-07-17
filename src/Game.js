import React, { Component } from 'react';
import styles from './styles';

class Game extends Component {
	constructor(props) {
		super(props);
		this.state = {
			wordToGuess : '',
			difficulty :  this.props.difficulty,
			defaultLives : 3,
			currentLives : 3,
			previousGuesses : [],
			uncoveredPart : []
		}
	}

	//jak komponent się zagnieździ - pobieramy jsona z pliku i wybieramy słowo
	componentDidMount() {
		this.loadWords();
	}

	//losuje randomowa liczbe w zakresie min(inclusive) - max(exclusive)
	getRandomInRange = (min, max) => {
    	return Math.floor(Math.random() * (max - min)) + min;
	}

	//pobiera jsona z pliku i wybiera słowo
	loadWords = () => {
		fetch("words.json")
			.then((res) => res.json())
			.then((data) => {
				let arrayOfPossibleWords = data[this.state.difficulty],
					randomNumber = this.getRandomInRange(0, arrayOfPossibleWords.length),
					randomWord = arrayOfPossibleWords[randomNumber].toUpperCase() ;
				this.setState({
					wordToGuess : randomWord
				})	
				this.createCoveredWord(randomWord);
		})
	}

	//wypełnienie tablicy o długości szukanego slowa znakami underscore zamiast liter
	createCoveredWord = (word) => {
		let coveredWord = [];
		for (var i = 0; i < word.length; i++) {
			coveredWord.push("_")
		}
		this.setState({
			uncoveredPart : coveredWord
		})
	}

	//handler dla zatwierdzenia wpisanej litery
	handleSubmit = (evt) => {
		//zapobiegamy przeładowaniu
		evt.preventDefault();
		let letter = this.refs.givenLetter.value.toUpperCase();
		const { previousGuesses, wordToGuess } = this.state;

		//sprawdzenie czy juz takiej nie bylo
		if (previousGuesses.indexOf(letter) === -1 && letter.length === 1) {
			//jak nie bylo to dodaj do listy uzytych
			this.setState({
				previousGuesses : [...previousGuesses, letter]
			})
			//sprawdzenie czy jest w szukanym slowie 
			if (wordToGuess.indexOf(letter) === -1) {
				//nie ma w slowie - zmniejszamy życia o 1
				this.reduceLives();
			} else { //jest w slowie
				//wypelniamy tablice uncoveredPart w kazdym miejscu wystepowania litery
				this.fillUncoveredPart(letter, this.getAllOccurences(wordToGuess, letter))
			}
		} else {
		//litera byla juz sprawdzana - nie robimy z nią nic
		}
		//reset inputu - wyczyszczenie litery
		this.refs.enterLetterForm.reset();
	}

	//zwraca tablicę wszystkich indexy, na których letter znajduje się w arr
	getAllOccurences = (arr, letter) => {
		let indexes = [], 
			length = arr.length;
		for(let i = 0; i < length; i++)
			if (arr[i] === letter){
				indexes.push(i);
			}
		return indexes;
	}

	//wypełnia zakrytą wersję słowa literą na wszystkich miejscach, gdzie występuje; jeśli słowo po odkryciu danej litery jest takie jak szukane - zwraca komunikat o wygranej
	fillUncoveredPart = (letter, indexes) => {
		let copyOfState = [...this.state.uncoveredPart];
		for (let index of indexes) {
			copyOfState[index] = letter;
		}
		this.setState({
			uncoveredPart : copyOfState
		})
		if (copyOfState.join("") === this.state.wordToGuess) {
			this.blockInput();
			this.sendAlert("win");
		}
	}

	//zmniejsza życia o 1; jeśli wynoszą 1 w momencie wywołania funkcji - wyświetla komunikat i blokuje możliwość interakcji z grą
	reduceLives = () => {
		let copyOfState = this.state.currentLives;
		this.setState({
			currentLives : copyOfState - 1
		})
		if (copyOfState === 1) {
			this.blockInput();
			this.sendAlert("loss");
		}
	}

	//po wygranej/przegranej blokada komunikacji z grą - zmiana inputu na readonly i zablokowanie buttona typu submit zeby nie mozna bylo sprawdzac czy "" nie znajduje sie w slowie
	blockInput = () => {
		this.refs.givenLetter.readOnly = "true";
		this.refs.submitButton.disabled = "true";
	}

	//wysyła komunikat po skoczonej grze - input: wygrana - "win", przegrana - "loss"
	sendAlert = (winOrLoss) => {
		if (winOrLoss === "win") {
			alert(
				"Zgadłeś! \n ╰( ◕ ᗜ ◕ )╯"
			)
		} else if (winOrLoss === "loss") {
			alert(
				"Skończyły ci się szanse! \n ლ(ಥ Д ಥ )ლ "
			)
		}
	}

	//wyświetla tablicę arrayToMap, dzieląc kolejne litery connector'em
	show = (arrayToMap, connector) => (
		arrayToMap.map(letter => (
			letter + connector
		))
	)

	render() {
		let { currentLives, defaultLives, uncoveredPart, previousGuesses } = this.state;
		return (
			<div style = { styles.generalStyles }>
				
				<p>
					Szanse: 
					{"\n"}
					{ currentLives } / { defaultLives }
				</p>
				
				<h1> 
					{ this.show(uncoveredPart, ' ') } 
				</h1>

				<form ref = "enterLetterForm" onSubmit = { this.handleSubmit } >
					<input type = "text" maxLength = { 1 } ref = "givenLetter" placeholder = "Podaj literę" autoFocus style = { styles.input } />
					<button type = "submit" ref = "submitButton" style = { styles.buttonSmall } > SPRAWDŹ </button>
				</form>
				
				<p>
					Już sprawdzone znaki:  
					<br />
					{ 
						this.show(previousGuesses, ', ')
					} 
                </p>
                
				<p>
					Dotychczas prób:  
					{"\n"}
					{ previousGuesses.length } 
				</p>
				
			</div>
		)
	}
}


export default Game;