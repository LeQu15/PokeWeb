import React, { useEffect, useState } from 'react';
import { useCallback } from 'react';
import Pokedex from 'pokedex-promise-v2';
const P = new Pokedex();

const Pokemon = (props) => {
	const [pokeDataArray, loadPokemonsData] = useState([]);
	const [displayArray, loadDisplay] = useState([]);
	const [index, changeIndex] = useState(0);
	const [inputValue, setInputValue] = useState('');
	const [test, changeTest] = useState([]);
	const [buttonArray, changeButtonArray] = useState(['']);
	const [sortType, changeSortType] = useState('aZ');
	const [pokemonsLoaded, changeLoaded] = useState(false);
	const [favouriteArray, changeFavouriteArray] = useState([]);
	const [pokeInfo, changePokeInfo] = useState(null);
	const [favouriteFlag, changeFavouriteFlag] = useState(false);

	const favouriteButton = React.createRef(null);
	const firstButton = React.createRef();
	const secondButton = React.createRef();

	useEffect(() => {
		P.getPokemonByName(props.array)
			.then((response) => {
				changeTest(response);
			})
			.catch((error) => {
				console.log('There was an ERROR: ', error);
			});
		if (localStorage.getItem('favourite')) {
			changeFavouriteArray(JSON.parse(localStorage.getItem('favourite')));
		}
	}, [props]);

	const updateData = useCallback(async () => {
		const newArray = [];
		let array;
		switch (sortType) {
			case 'aZ':
				array = test.sort((a, b) => {
					if (a.name < b.name) {
						return -1;
					} else if (a.name > b.name) {
						return 1;
					} else return 0;
				});
				break;
			case 'zA':
				array = test.sort((a, b) => {
					if (b.name < a.name) {
						return -1;
					} else if (b.name > a.name) {
						return 1;
					} else return 0;
				});
				break;
			case 'typeFirst':
				array = test.sort((a, b) => {
					if (a.types[0].type.name < b.types[0].type.name) {
						return -1;
					} else if (a.types[0].type.name > b.types[0].type.name) {
						return 1;
					} else return 0;
				});
				break;
			case 'typeLast':
				array = test.sort((a, b) => {
					if (b.types[0].type.name < a.types[0].type.name) {
						return -1;
					} else if (b.types[0].type.name > a.types[0].type.name) {
						return 1;
					} else return 0;
				});
				break;
			default:
				array = test.sort(function (a, b) {
					return a.name - b.name;
				});
				break;
		}

		array = array.filter(function (element) {
			return element.name.startsWith(
				inputValue.replace(' ', '-').toLowerCase()
			);
		});

		if (favouriteFlag) {
			array = array.filter(function (element) {
				if (favouriteArray.includes(element.name)) return element;
				else return false;
			});
		}

		changeButtonArray(array);

		if (array.length > 0) {
			if (index === parseInt(array.length / 30)) {
				for (
					let i = index * 30;
					i < (index + 1) * 30 - 30 + (array.length % 30);
					i++
				) {
					const newElem = array[i];
					newArray.push(newElem);
				}
			} else {
				for (let i = index * 30; i < (index + 1) * 30; i++) {
					const newElem = array[i];
					newArray.push(newElem);
				}
			}
			loadPokemonsData(newArray);
		} else loadPokemonsData([]);
	}, [index, inputValue, sortType, test, favouriteFlag, favouriteArray]);

	useEffect(() => {
		updateData();
	}, [updateData]);

	const sortPokemons = (e) => {
		if (e.target.innerHTML === 'Name') {
			if (sortType === 'aZ') {
				changeSortType('zA');
			} else {
				changeSortType('aZ');
			}
		} else {
			if (sortType === 'typeFirst') {
				changeSortType('typeLast');
			} else {
				changeSortType('typeFirst');
			}
		}
	};

	const favourite = useCallback(
		(e) => {
			const array = [...favouriteArray];
			if (
				!array.includes(
					e.target.parentNode.parentNode.getAttribute('data-name')
				)
			) {
				array.push(e.target.parentNode.parentNode.getAttribute('data-name'));
			} else {
				const index = array.indexOf(
					e.target.parentNode.parentNode.getAttribute('data-name')
				);
				if (index !== -1) {
					array.splice(index, 1);
				}
			}
			changeFavouriteArray(array);
		},
		[favouriteArray]
	);

	const showFavourite = useCallback(() => {
		changeIndex(0);
		if (favouriteArray.length > 0) {
			if (favouriteFlag === true) {
				favouriteButton.current.classList.remove('favouriteOn');
				changeFavouriteFlag(false);
			} else {
				favouriteButton.current.classList.add('favouriteOn');
				changeFavouriteFlag(true);
			}
		} else {
			favouriteButton.current.classList.remove('favouriteOn');
		}
	}, [favouriteArray, favouriteButton, favouriteFlag]);

	useEffect(() => {
		if (!favouriteArray.length > 0) {
			changeFavouriteFlag(false);
			if (favouriteButton.current) {
				favouriteButton.current.classList.remove('favouriteOn');
			}
		}
		localStorage.setItem('favourite', JSON.stringify(favouriteArray));
	}, [favouriteArray, favouriteButton]);

	const closePokeInfo = () => {
		changePokeInfo(null);
	};

	const updatePokeInfo = useCallback((e) => {
		if (e.target.classList.contains('pokemon')) {
			P.getPokemonByName(e.target.getAttribute('data-name'))
				.then((response) => {
					changePokeInfo(
						<div className='pokeInfo'>
							<button onClick={closePokeInfo}>X</button>
							<div className='pokeName'>{response.name.replace(/-/g, ' ')}</div>
							<div className='pokeIcon'>
								<img src={response.sprites.front_default} alt={response.name} />
							</div>
							<div className='pokeStats'>
								<div className='health'>
									<i className='fa-solid fa-heart'></i>
									{response.stats[0].base_stat}
								</div>
								<div className='attack'>
									<i className='fa-solid fa-gun'></i>
									{response.stats[1].base_stat}
								</div>
								<div className='defense'>
									<i className='fa-solid fa-shield'></i>
									{response.stats[2].base_stat}
								</div>
								<div className='speed'>
									<i className='fa-solid fa-shoe-prints'></i>
									{response.stats[5].base_stat}
								</div>
							</div>
							<div>Work in progress</div>
						</div>
					);
				})
				.catch((error) => {
					console.log('There was an ERROR: ', error);
				});
		}
	}, []);

	const displayPokemon = useCallback(() => {
		if (pokeDataArray.length > 0) {
			changeLoaded(true);
			let array = pokeDataArray.map((elem, index) => (
				<div
					className={
						'pokemon ' + (favouriteArray.includes(elem.name) ? 'favourite' : '')
					}
					key={index}
					data-name={elem.name}
					onClick={updatePokeInfo}
				>
					<div className='addFavourite' onClick={favourite}>
						<i className='fa-solid fa-heart'></i>
					</div>
					<div className='icon'>
						<img src={elem.sprites.front_default} alt={elem.name} />
					</div>
					<div className='name'>
						{elem.name.replace(/-/g, ' ')}
						<div className='type'>{elem.types[0].type.name}</div>
					</div>
					<div className='stats'>
						<div className='health'>
							<i className='fa-solid fa-heart'></i>
							{elem.stats[0].base_stat}
						</div>
						<div className='attack'>
							<i className='fa-solid fa-gun'></i>
							{elem.stats[1].base_stat}
						</div>
						<div className='defense'>
							<i className='fa-solid fa-shield'></i>
							{elem.stats[2].base_stat}
						</div>
						<div className='speed'>
							<i className='fa-solid fa-shoe-prints'></i>
							{elem.stats[5].base_stat}
						</div>
					</div>
				</div>
			));
			loadDisplay(array);
		} else {
			let element = (
				<div className='pokemon' key={0}>
					<div className='addFavourite'>
						<i className='fa-solid fa-heart-crack'></i>
					</div>
					<div className='icon'>
						<img
							src='https://wiki.p-insurgence.com/images/0/09/722.png'
							alt='missingno'
						/>
					</div>
					<div className='name'>
						Missingno
						<div className='type'>???</div>
					</div>
					<div className='stats'>
						<div className='health'>
							<i className='fa-solid fa-heart'></i>
							???
						</div>
						<div className='attack'>
							<i className='fa-solid fa-gun'></i>
							???
						</div>
						<div className='defense'>
							<i className='fa-solid fa-shield'></i>
							???
						</div>
						<div className='speed'>
							<i className='fa-solid fa-shoe-prints'></i>
							???
						</div>
					</div>
				</div>
			);
			loadDisplay([element]);
		}
	}, [pokeDataArray, favouriteArray, favourite, updatePokeInfo]);

	useEffect(() => {
		displayPokemon();
	}, [pokeDataArray, displayPokemon]);

	const handleChangeIndex = (e) => {
		if (e.target === firstButton.current) {
			changeIndex(index - 1);
		} else {
			changeIndex(index + 1);
		}
	};

	const changeButtons = useCallback(() => {
		if (index === parseInt(buttonArray.length / 30)) {
			secondButton.current.disabled = true;
		} else {
			secondButton.current.disabled = false;
		}
		if (index === 0) {
			firstButton.current.disabled = true;
		} else {
			firstButton.current.disabled = false;
		}
	}, [secondButton, firstButton, index, buttonArray]);

	useEffect(() => {
		if (pokemonsLoaded) {
			changeButtons();
		}
	}, [index, changeButtons, buttonArray, pokemonsLoaded]);

	const changeInputHandler = (e) => {
		setInputValue(e.target.value);
		changeIndex(0);
	};

	const loaded = () => {
		if (pokemonsLoaded) {
			return (
				<>
					<div className='options'>
						<input
							type='text'
							placeholder='Pokemon'
							onChange={changeInputHandler}
							value={inputValue}
						></input>
						<div className='filters'>
							<button onClick={sortPokemons}>Name</button>
							<button onClick={sortPokemons}>Type</button>
							<button
								ref={favouriteButton}
								className='favourite'
								onClick={showFavourite}
								disabled={favouriteArray.length > 0 ? false : true}
							>
								<i className='fa-solid fa-heart'></i>
							</button>
						</div>
						<div className='buttons'>
							<button onClick={handleChangeIndex} ref={firstButton}>
								{'<'}
							</button>
							<button ref={secondButton} onClick={handleChangeIndex}>
								{'>'}
							</button>
						</div>
					</div>
					<div className='pokemon-container'>{displayArray}</div>
				</>
			);
		} else {
			return (
				<div className='animation'>
					<div className='lds-circle'>
						<img
							src='https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Pokebola-pokeball-png-0.png/800px-Pokebola-pokeball-png-0.png'
							alt=''
						/>
					</div>
					Loading...
				</div>
			);
		}
	};

	return (
		<>
			{pokeInfo}
			{loaded()}
		</>
	);
};

export default Pokemon;
