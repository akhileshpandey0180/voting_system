// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract Voting {
    struct Candidate {
        string name;
        uint voteCount;
    }

    mapping(string => Candidate) public candidates;
    string[] public candidateList;

    event VoteCast(string candidateName, address voter);

    constructor() {} // Explicit constructor

    function addCandidate(string memory _name) public {
        require(bytes(candidates[_name].name).length == 0, "Candidate exists");
        candidates[_name] = Candidate(_name, 0);
        candidateList.push(_name);
    }

    function vote(string memory _candidateName) public {
        require(bytes(candidates[_candidateName].name).length > 0, "Invalid candidate");
        candidates[_candidateName].voteCount++;
        emit VoteCast(_candidateName, msg.sender);
    }

    function getVoteCount(string memory _candidateName) public view returns (uint) {
        return candidates[_candidateName].voteCount;
    }

    function getAllCandidates() public view returns (string[] memory) {
        return candidateList;
    }
}