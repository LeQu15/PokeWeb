import React, { useEffect, useState } from 'react';
import Pokemon from './Pokemon';

const PokemonList = () => {
	const [pokeArray, loadPokemons] = useState(['']);

	useEffect(() => {
		if (pokeArray.length < 2) {
			const fetchData = async () => {
				try {
					const response = await fetch(
						'https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0'
					);
					const json = await response.json();
					if (!response.ok) {
						throw Error(response.statusText);
					} else {
						const array = [];
						const bannedPokemons = [
							'araquanid-totem',
							'arcanine-hisui',
							'avalugg-hisui',
							'basculegion-female',
							'basculegion-male',
							'basculin-white-striped',
							'braviary-hisui',
							'cramorant-gorging',
							'cramorant-gulping',
							'decidueye-hisui',
							'dialga-origin',
							'eevee-starter',
							'electrode-hisui',
							'enamorus-incarnate',
							'enamorus-therian',
							'goodra-hisui',
							'growlithe-hisui',
							'kleavor',
							'kommo-o-totem',
							'lilligant-hisui',
							'lurantis-totem',
							'morpeko-hangry',
							'overqwil',
							'palkia-origin',
							'pikachu-starter',
							'pikachu-world-cap',
							'qwilfish-hisui',
							'salazzle-totem',
							'samurott-hisui',
							'sliggoo-hisui',
							'sneasel-hisui',
							'sneasler',
							'togedemaru-totem',
							'typhlosion-hisui',
							'ursaluna',
							'voltorb-hisui',
							'wyrdeer',
							'zarude-dada',
							'zorua-hisui',
							'zoroark-hisui',
							'zygarde-10',
						];
						for (let i = 0; i < json.results.length; i++) {
							if (!bannedPokemons.includes(json.results[i].name)) {
								array.push(json.results[i].name);
							}
						}
						loadPokemons(array);
					}
				} catch (error) {
					console.error(error);
				}
			};
			fetchData();
		}
	}, [pokeArray]);
	return <>{pokeArray.length > 1 ? <Pokemon array={pokeArray} /> : ''}</>;
};

export default PokemonList;
