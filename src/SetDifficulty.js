import React from 'react';
import styles from './styles';

//komponent ustawiający poziom trudności, functional stateless
const SetDifficulty = (props) => {
	let difficulties = props.availableDifficulties; 
	return (
		<div style = { styles.generalStyles }>
			<h1>Wybierz poziom trudności </h1>
			{
				difficulties.map((difficulty, i) => {
					//easy
					let levelValue = Object.keys(difficulty)[0],
					//łatwy	
						levelName = difficulty[levelValue];
					return (
						<button onClick = { props.setDefficultyInParent.bind(this, levelValue) } key = { i } style = { styles.button } > { levelName.toUpperCase() } </button>
					)
				})
			}

		</div>
	)
}

export default SetDifficulty;