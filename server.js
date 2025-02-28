const express = require('express');
const app = express();
const port = 3001; // You can use a different port

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://127.0.0.1:27017/voting-system"; // Default MongoDB connection string

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }) 
.then(client => {
    console.log("Connected to MongoDB!");
    const db = client.db('voting-system'); // Replace 'voting-system' with your database name
    // ... You can now interact with your database using the 'db' object 
})
.catch(err => {
    console.error("Error connecting to MongoDB:", err);
});

// ... rest of your Express.js server setup


require('dotenv').config();
const Web3 = require('web3').default;
const web3 = new Web3('http://127.0.0.1:8545'); // Connect to Ganache     // Get the contract ABI:
const contractAddress = process.env.CONTRACT_ADDRESS;
const contractABI = require('../contact/build/contracts/Voting.json').abi; // Update path
// Create a contract instance:
const votingContract = new web3.eth.Contract(contractABI, contractAddress);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.get('/candidates', async (req, res) => {
    try {
      const candidates = await votingContract.methods.getAllCandidates().call();
      res.json(candidates); // Send the candidate list as JSON 
    } catch (error) {
      console.error("Error fetching candidates:", error);
      res.status(500).send("Error fetching candidates");
    }
  });
// ... add other endpoints for adding candidates, casting votes,
app.post('/candidates', async (req, res) => {
    const candidateName = req.body.name; // Assuming you get candidate name from request body
    try {
      // Get the accounts from your connected Web3 provider
      const accounts = await web3.eth.getAccounts();
  
      // Send the transaction to add the candidate
      await votingContract.methods.addCandidate(candidateName).send({ from: accounts[0] }); 
      res.status(201).send("Candidate added successfully!"); 
    } catch (error) {
      console.error("Error adding candidate:", error);
      res.status(500).send("Error adding candidate");
    }
  }); 
//     getting vote counts, etc
app.get('/', (req, res) => {
    res.send('Voting System Backend!'); 
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
