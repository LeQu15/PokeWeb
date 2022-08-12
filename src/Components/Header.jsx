import logo from '../img/logo.png';
import pokeball from '../img/pokeball.png';


function Header() {
	return (
		<header>
			<div className='pokeballs'>
				<img src={pokeball} alt='' />
				<img src={pokeball} alt='' />
				<img src={pokeball} alt='' />
			</div>
			<img src={logo} alt='logo' />
			<div className='pokeballs'>
				<img src={pokeball} alt='' />
				<img src={pokeball} alt='' />
				<img src={pokeball} alt='' />
			</div>
		</header>
	);
}

export default Header;
