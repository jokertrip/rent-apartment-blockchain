import Link from 'next/link';

import Logo from './Logo';
import classes from './Header.module.css'

const Header = () => {
    return (
        <div className={classes.header}>
            <Link href='/'>
                <a>
                    <Logo />
                </a>
            </Link>
            <Link href='/new-room'>Become a host</Link>
        </div>
    )
}

export default Header;
