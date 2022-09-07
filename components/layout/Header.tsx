import Link from 'next/link';

import classes from './Header.module.css'

const Header = () => {
    return (
        <header className={classes.header}>
            <div className={classes.logo}>
                <Link href='/'>Rent a room</Link>
            </div>
            <nav className={classes.navigation}>
                <ul>
                    <li>
                        <Link href='/new-room'>Become a host</Link>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Header;
