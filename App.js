import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

// Import your contract ABI
const contractABI = require('./Voting.json').abi;

function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [newCandidate, setNewCandidate] = useState('');
  const [userHasVoted, setUserHasVoted] = useState(false);  // Track if user has voted
  const [message, setMessage] = useState('');

  useEffect(() => {
    const initializeWeb3 = async () => {
      if (window.ethereum) {
        try {
          // Request account access if needed
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          // Create contract instance 
          const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;  // Contract address from environment
          const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
          setContract(contractInstance);

          // Fetch initial data from the contract
          await fetchCandidates(contractInstance);
        } catch (error) {
          console.error("Error connecting to web3:", error);
          setMessage("Please install MetaMask or enable Web3.");
        }
      } else {
        setMessage("Please install MetaMask!");
      }
    };

    initializeWeb3();
  }, []);

  const fetchCandidates = async (contractInstance) => {
    try {
      const candidatesCount = await contractInstance.methods.getCandidatesCount().call();
      const candidatesList = [];

      for (let i = 0; i < candidatesCount; i++) {
        const candidate = await contractInstance.methods.candidates(i).call();
        candidatesList.push(candidate);
      }
      setCandidates(candidatesList);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setMessage("Error fetching candidates.");
    }
  };

  const handleAddCandidate = async () => {
    if (!newCandidate) {
      setMessage('Candidate name cannot be empty!');
      return;
    }

    try {
      const accounts = await web3.eth.getAccounts();
      const response = await contract.methods.addCandidate(newCandidate).send({ from: accounts[0] });

      setMessage('Candidate added successfully!');
      setNewCandidate('');
      fetchCandidates(contract); // Refresh the candidates list
    } catch (error) {
      console.error('Error adding candidate:', error);
      setMessage('Error adding candidate.');
    }
  };

  const handleVote = async (candidate) => {
    if (userHasVoted) {
      setMessage('You have already voted!');
      return;
    }

    try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods.vote(candidate).send({ from: accounts[0] });
      
      setMessage(`You voted for ${candidate}!`);
      setUserHasVoted(true);  // Mark as voted
    } catch (error) {
      console.error('Error voting:', error);
      setMessage('Error casting your vote.');
    }
  };

  return (
  <div class="container">
    <header>
      <h1>Online Voting System</h1>
    </header>
    <section class="candidates">
      <h2>Choose Your Candidate</h2>
      <div class="candidate-list">
        <div class="candidate">
          <img src="C:\Users\Akhishooter\voting system\frontend\public\dimplebhabhi.jpg" alt="Candidate 1" />
          <h3>Candidate 1</h3>
          <button class="vote-btn" data-candidate="1">Vote</button>
        </div>
        <div class="candidate">
          <img src="C:\Users\Akhishooter\voting system\frontend\public\dimplebhabhi.jpg" alt="Candidate 2" />
          <h3>Candidate 2</h3>
          <button class="vote-btn" data-candidate="2">Vote</button>
        </div>
        <div class="candidate">
          <img src="C:\Users\Akhishooter\voting system\frontend\src\dimplebhabhi.jpg" alt="Candidate 3" />
          <h3>Candidate 3</h3>
          <button class="vote-btn" data-candidate="3">Vote</button>
        </div>
      </div>
    </section>
    <section class="results">
      <h2>Vote Results</h2>
      <div class="result">
        <h3>Candidate 1</h3>
        <div class="progress-bar" id="progress1"></div>
      </div>
      <div class="result">
        <h3>Candidate 2</h3>
        <div class="progress-bar" id="progress2"></div>
      </div>
      <div class="result">
        <h3>Candidate 3</h3>
        <div class="progress-bar" id="progress3"></div>
      </div>
    </section>
  </div>


  );
}

export default App;
