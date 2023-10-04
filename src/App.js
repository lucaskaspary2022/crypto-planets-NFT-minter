import { useState, useEffect } from 'react';
import './App.css';
import MainMint from './components/MintSection/MainMint';
import NavBar from './components/NavBar/NavBar';
import { ethers, BigNumber } from 'ethers';
// import cryptoPlanets from './CryptoPlanets.json';
import cryptoPlanets from './planetsTest.json'

// const cryptoPlanetsAddress = '0x78f12AC7f46F7F1133BCAC2F991e4Be99A2D2351'
const cryptoPlanetsAddress = "0xceEF078D6a236EC84C2A84139A2A94f1e42E89e3"

function App() {
  const [accounts, setAccounts] = useState([])
  const [contract, setContract] = useState('')
  const [isPaused, setIsPaused] = useState(true)
  const [mintPrice, setMintPrice] = useState(0)
  const [maxSupply, setMaxSupply] = useState(0)
  const [totalSupply, setTotalSupply] = useState(0)
  const [person, setPerson] = useState()

  const callPerson = () => {
    setPerson('Lucas')
  }
  // useEffect(() => {

  //   const contract = 0

  //   const init = async () => {
  //     if (window.ethereum) {
  //       try {
  //         // Setup provider and signer
  //         const provider = new ethers.providers.Web3Provider(window.ethereum);
  //         const signer = provider.getSigner();
          
  //         // Get accounts and set it
  //         const accounts = await signer.listAccounts();
  //         setAccounts(accounts);
  
  //         // Setup contract
  //         const nftContract = new ethers.Contract(cryptoPlanetsAddress, cryptoPlanets.abi, signer);
  //         setContract(nftContract);
  //         contract = nftContract

  //         console.log("Contract: ")
  
  //         // Fetch contract details
  //         const isPaused = await nftContract.paused();
  //         const mintPrice = await nftContract.mintPrice();
  //         const maxSupply = await nftContract.maxSupply();
  //         const totalSupply = await nftContract.totalSupply();
  
  //         // Update states
  //         setIsPaused(isPaused);
  //         setMintPrice(mintPrice);
  //         setMaxSupply(maxSupply);
  //         setTotalSupply(totalSupply);
  
  //       } catch (error) {
  //         console.error("An error occurred:", error);
  //       }
  //     } else console.log("pau")
  //   };
  
  //   init();

  //   console.log("Contract: ",contract)

  // }, []);

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const nftContract = new ethers.Contract(
          cryptoPlanetsAddress,
          cryptoPlanets.abi,
          signer
      )

      console.log(nftContract)

      nftContract.paused().then((result) => {
        console.log("Test:", result)
        setIsPaused(result)
      })

      nftContract.mintPrice().then((result) => {
        setMintPrice(result)
      })

      nftContract.maxSupply().then((result) => {
        setMaxSupply(result)
      })

      nftContract.totalSupply().then((supply) => {
        setTotalSupply(supply)
      
      })

      // console.log('paused: ', nftContract.mintPrice())
      
      setContract(nftContract)
    } 

  }, [])

  return (
    <div className='overlay'>
      <div className="App">
        <NavBar accounts={accounts} setAccounts={setAccounts}/>
        <MainMint 
          accounts={accounts} 
          setAccounts={setAccounts} 
          contract={contract} 
          isPaused={isPaused}
          mintPrice={mintPrice}
          maxSupply={maxSupply}
          totalSupply={totalSupply}
        />
      </div>
      <button onClick={setPerson}>Call Person</button>
      <div className='moving-background'></div>
    </div>
  );
}

export default App;
