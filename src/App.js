import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import "./App.css";
import contractJson from './utils/WavePoratl.json'
 
const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const contractAddress = "0x24D4a7AA264f4f999040656c59cd432BcA715241" // polygon scan -> to cotract hash
  const contractABI = contractJson.abi
  const [waves,setWaves] = useState([]);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
 
      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }
 
      const accounts = await ethereum.request({ method: "eth_accounts" });
 
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }
 
  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
 
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
 
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
 
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    getAllWave();
  },[waves.length])

  
const wave = async () => {
  try {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

      let count = await wavePortalContract.getTotalWaves();
      console.log("Retrieved total wave count...", count.toNumber());

      /*
      * Execute the actual wave from your smart contract
      */
      const waveTxn = await wavePortalContract.wave("Hello this is my msg from react app");
      console.log("Mining...", waveTxn.hash);

      await waveTxn.wait();
      console.log("Mined -- ", waveTxn.hash);

      count = await wavePortalContract.getTotalWaves();
      console.log("Retrieved total wave count...", count.toNumber());
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error);
  }
}

const getAllWave=async ()=>{
  try{
    const {ethereum} = window;

    if(ethereum){
     const provider = new ethers.providers.Web3Provider(ethereum);
     const signer = provider.getSigner();
     const wavePortalContract = new ethers.Contract(contractAddress,contractABI,signer);

    const waves = await wavePortalContract.getAllWaves();

    let waveCleand = [];
    waves.forEach(wave=>{
      waveCleand.push({
        address: wave.sender,
        timestamp: new Date(wave.timestamp * 1000),
        message: wave.message 
      })
    })
    setWaves(waveCleand);
    console.log(waveCleand);
    }
  }catch(err){
    console.log(err);
  }
}

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>
 
        <div className="bio">
          I am Chetan Kochiyaniya and I worked on Blockchain so that's pretty cool right? Connect your Ethereum wallet and wave at me!
        </div>
 
        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>
 
        {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}


        {waves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}

      </div>
    </div>
  );
}
 
export default App