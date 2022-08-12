function SortPokemons(test, sortType) {
	let array = [];
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
	return array;
}

export default SortPokemons;
