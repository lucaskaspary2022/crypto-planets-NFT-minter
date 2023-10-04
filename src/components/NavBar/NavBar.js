import {React, useState}  from 'react';
import { Nav } from './NavBarElements'
import './NavBar.css'
import earth from './earth.png'

const Navbar = ({accounts, setAccounts}) => {
    const isConnected = Boolean(accounts[0]);
    const [scrollNav, setScrollNav] = useState(false)

    async function connectAccount() { // study properly how async functions work to avoid the shit
        if (window.ethereum) {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts"
            })
            setAccounts(accounts)
        }
    }

    const changeNav = () => {
        if (window.scrollY >= 20) {
            setScrollNav(true)
        }  
        else {
            setScrollNav(false)
        }
    }

    return (
        <div>
            <Nav scrollNav={scrollNav}>
                <div className='nav-logo-container'>
                    <div className='logo-container'>
                        <img alt='logo' src={earth} className='earth-logo'></img>
                    </div>
                    <h1 className='name'>Crypto Planets</h1>
                </div>
                <div className='menu-side'>
                    <div className='menu'>
                        <p>Home</p>
                        <p>Info</p>
                        <p>Socials</p>
                    </div>
                    {isConnected ? (
                        <div className='connect-button'><p className='button-p'>Connected</p></div>
                    ) : (
                        <div className='connect-button' onClick={connectAccount}><p className='button-p'>Connect</p></div>
                    )}    
                </div>            
            </Nav>

        </div>
    )
}

export default Navbar