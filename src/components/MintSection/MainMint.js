import React, { useState, useEffect } from 'react';
import { ethers, BigNumber } from 'ethers';
import cryptoPlanets from '../../CryptoPlanets.json';
import './MainMint.css'
import planet from './planet.png'
import newPlanet from './improvedNewPlanet.png'
import { FaEthereum } from 'react-icons/fa';
import Popup from 'reactjs-popup';
import './modal.css'


const cryptoPlanetsAddress = '0x78f12AC7f46F7F1133BCAC2F991e4Be99A2D2351'
const divider = 1000000000000000000

// const MainMint = ({accounts, setAccounts, contract, isPaused, mintPrice, maxSupply, totalSupply}) => {
function MainMint({accounts, setAccounts, contract, isPaused, mintPrice, maxSupply, totalSupply}) {
    const [mintAmount, setMintAmount] = useState(1)
    const isConnected = Boolean(accounts[0])

    console.log('MainMint.js called', mintPrice)

    async function handleMint() {
        try {
            const response = await contract.mint(BigNumber.from(mintAmount), {
                value: ethers.utils.parseEther((0.02 * mintAmount).toString())
            }) // it is running the mint function from the solidity contract and passing _quantity parameter
            console.log("response: ", response)
            
        } catch (err) {
            console.log("error: ", err)
        }
    }

    const handleDecrement = () => {
        if (mintAmount <= 1) return
        setMintAmount(mintAmount - 1)
    }

    const handleIncrement = () => {
        if (mintAmount >= 3) return
        setMintAmount(mintAmount + 1)
    }

    return (
        <main className='main-mint-page'>
            <div className='text-side'>
                <h1 className='big-text'>Crypto Planets</h1>
                <p className='small-text'>Just a small percent of our entire universe</p>
                <div className='price-section'>
                    <div className='price-wrapp'>
                        <h1 className='price-value'>{(mintPrice/divider)}</h1>
                        {/* <div className='ethereum'> */}
                            <FaEthereum className='ethereum-icon'/>
                        {/* </div>                         */}
                    </div>
                    <h4 className='price-description'>per planet</h4>
                </div>
                {isConnected ? (
                    <div>
                        {isPaused ? (<p>Mint not available</p>) : (
                        <div className='mint-section'>
                            <div className='count-button' onClick={handleDecrement}>-</div>
                            {/* <input type='number' value={mintAmount} className='input-field'></input> */}
                            <div className='mint-button' onClick={handleMint}>Mint {mintAmount}</div>
                            <div className='count-button' onClick={handleIncrement}>+</div>
                        </div>  
                        )}        
                    </div>
                ): (
                    <p>You must be connected to mint</p>
                )}
                <div className='supply-section'>
                    <p className='supply'>{String(totalSupply)}/{String(maxSupply)}</p>
                    <p className='supply-p'>minted</p>
                </div>              
            </div>
            <div className='image-side'>
                <img alt='planet' src={newPlanet} className='planet-image'></img>
                {/* <img alt='planet' src='https://ipfs.io/ipfs/QmW4qFjMzhvC6FRkFJ95wnpQHc1T6qQoTZLmQJVVV5gBB1/9.png' className='planet-image'></img> */}
            </div>
        </main>
    )

}

export default MainMint = React.memo(MainMint);
