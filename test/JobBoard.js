const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Job Board", function() {
    let JobBoard;
    let jobBoard;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function() {
        JobBoard = await ethers.getContractFactory("JobBoard");
        [owner, addr1, addr2] = await ethers.getSigners();

        jobBoard = await JobBoard.deploy();
        //await jobBoard.waitForDeployment();
    });

    describe("Deployment", function() {
        it("Should set the owner correctly", async function(){
            expect(await jobBoard.admin().to.equal(owner.address));
        });
    });

    describe("addJob", function() {
        it("should add a job correctly", async function() {
            const companyName = "Test company";
            const position = "software engineer";
            const description = "Job description";
            const employmentType = "Full-time";
            const location = "Test Location";
            const companyWebsiteUrl = "https://testcomapny.com";

            await jobBoard.addJob(
                companyName,
                position,
                description,
                employmentType,
                location,
                companyWebsiteUrl,
                { value: ethers.utils.parseEthers("0.005") }
            );

            const totalJobs = await jobBoard.totalJobs();
            expect(totalJobs).to.equal(1);

            const job = await jobBoard.jobs(0);
            expect(job.jobId).to.equal(0);
            expect(job.companyName).to.equal(companyName);
            expect(job.position).to.equal(position);
            expect(job.description).to.equal(description);
            expect(job.employmentType).to.equal(employmentType);
            expect(job.location).to.equal(location);
            expect(job.companyWebsiteUrl).to.equal(companyWebsiteUrl);
            expect(job.employer).to.equal(owner.address);
        });
    });

    describe("deleteJob", function() {
        it("should delete a job correctly", async function() {
            //add a job first
            await jobBoard.addJob(
                "test company",
                "software engineer",
                "job description",
                "full-time",
                "test location",
                "https://testcompany.com",
                { value: ethers.utils.parseEthers("0.005") }
            );

            const totalJobsBeforeDelete = await jobBoard.totalJobs();
            expect(totalJobsBeforeDelete).to.equal(1);

            await jobBoard.connect(owner).deleteJob(0);

            const totalJobsAfterDelete = await jobBoard.totalJobs();
            expect(totalJobsAfterDelete).to.equal(0);
        });

        it("should only allow the employer or the admin to delete a job", async function() {
            //add a job first
            await jobBoard.addJob(
                "Test company",
                "Software Engineer",
                "Job Description",
                "Full-time",
                "Test location",
                "https://testcomapny.com",
                { value: ethers.utils.parseEthers("0.005") }
            );

            await expect(
                jobBoard.connect(addr1).deleteJob(0)
            ).to.be.revertedWith("Ownable: caller is not the owner");

            await jobBoard.connect(owner).deleteJob(0);
            const totalJobsAfterDelete = await jobBoard.totalJobs();
            expect(totalJobsAfterDelete).to.equal(0);
        });
    });

});