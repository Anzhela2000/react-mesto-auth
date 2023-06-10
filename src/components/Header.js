import logo from '../images/logo.svg';

function Header({enter, userData}) {
    return (<header className="header">
    <img src={logo} className="header__logo" alt="logo" />
    <p className='header__user'>{userData}</p>
    <a className='header__enter'>{enter}</a>
    </header>)
}

export default Header;