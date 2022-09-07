import Header from './Header'
import React, { Fragment } from 'react'

type Props = {
    children?: React.ReactNode;
};

const Layout = ({children}:Props) => {
    return (
        <Fragment>
            <Header />
            {children}
        </Fragment>
    )
}
export default Layout
