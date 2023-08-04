// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract JobBoard is Ownable {
    uint256 public JOB_ID = 0;
    
    constructor(){}

    // Job datatype
    struct Job {
        uint256 jobId;
        string companyName;
        string position;
        string description;
        string employmentType;
        string location;
        string companyWebsiteUrl;
        address employer;
    }

    Job[] public jobs;
    mapping(address => address[]) public applicants;

    //add a job
    function addJob(
        string memory _companyName,
        string memory _position,
        string memory _description,
        string memory employmentType,
        string memory _location,
        string memory _companyWebsiteUrl
    ) public payable {
        require(msg.value == 5 * 10**15);
        Job memory job = Job({
            jobId: jobs.length,
            companyName: _companyName,
            position: _position,
            description: _description,
            employmentType: employmentType,
            location: _location,
            companyWebsiteUrl: _companyWebsiteUrl,
            employer: msg.sender
        });
        jobs.push(job);
    }

    //return all jobs
    function allJobs() public view returns (Job[] memory){
        return jobs;
    }

    //delete a job
    function deleteJob(uint256 _jobId) public onlyOwner {
        require(_jobId < jobs.length, "Job does not exist");
              
        jobs[_jobId] = jobs[
            jobs.length - 1
        ];
  
        jobs.pop();
    }

    //Apply for a job
    function applyForJob(uint256 _jobid) public {
        applicants[jobs[_jobid].employer].push(msg.sender);
    }

    //return this
    function admin() public view returns (address){
        return owner();
    }

    function withdraw(address payable _adminAddress) public onlyOwner {
        _adminAddress.transfer(address(this).balance);
    }

    function totalJobs() public view returns (uint256){
        return jobs.length;
    }
}