import React, { useState, useEffect } from 'react';

function CandidateList() {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await fetch('http://localhost:3001/candidates'); // Your backend endpoint
        const data = await response.json();
        setCandidates(data);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };

    fetchCandidates();
  }, []); 

  return (
    <ul>
      {candidates.map((candidate, index) => (
        <li key={index}>{candidate}</li>
      ))}
    </ul>
  );
}

export default CandidateList;
