// const { expect } = require("chai");
// const { ethers } = require("hardhat");

// describe("Reputation", function () {
//     let Reputation, reputation, MockAccessRestriction, accessRestriction, owner, approvedContract, user1, user2;

//     beforeEach(async function () {
//         // Deploy the mock AccessRestriction contract
//         MockAccessRestriction = await ethers.getContractFactory("MockAccessRestriction");
//         accessRestriction = await MockAccessRestriction.deploy();
//         await accessRestriction.deployed();

//         // Deploy the Reputation contract with the mock AccessRestriction address
//         Reputation = await ethers.getContractFactory("Reputation");
//         [owner, approvedContract, user1, user2, _] = await ethers.getSigners();
//         reputation = await Reputation.deploy(accessRestriction.address);
//         await reputation.deployed();

//         // Grant the approvedContract the necessary role in the mock AccessRestriction contract
//         await accessRestriction.setApprovedContract(approvedContract.address, true);
//     });

//     describe("Constructor", function () {
//         it("should set the correct accessRestriction address", async function () {
//             const accessRestrictionAddress = await reputation.accessRestriction();
//             expect(accessRestrictionAddress).to.equal(accessRestriction.address);
//         });
//     });

//     describe("updateReputation", function () {
//         it("should update the reputation score for a user", async function () {
//             await reputation.connect(approvedContract).updateReputation(1, user1.address, 10);
//             const reputationScore = await reputation.reputationScores(user1.address);
//             expect(reputationScore).to.equal(10);
//         });

//         it("should correctly handle negative reputation changes", async function () {
//             await reputation.connect(approvedContract).updateReputation(1, user1.address, 10);
//             await reputation.connect(approvedContract).updateReputation(2, user1.address, -5);
//             const reputationScore = await reputation.reputationScores(user1.address);
//             expect(reputationScore).to.equal(5);
//         });

//         it("should emit the ReputationUpdated event", async function () {
//             await expect(reputation.connect(approvedContract).updateReputation(1, user1.address, 10))
//                 .to.emit(reputation, "ReputationUpdated")
//                 .withArgs(1, user1.address, 10, 10);
//         });

//         it("should revert if the user address is zero", async function () {
//             await expect(reputation.connect(approvedContract).updateReputation(1, ethers.constants.AddressZero, 10))
//                 .to.be.revertedWith("InvalidAddress(\"user\")");
//         });

//         it("should revert if called by a non-approved contract", async function () {
//             await expect(reputation.connect(user1).updateReputation(1, user1.address, 10))
//                 .to.be.revertedWith("Not an approved contract");
//         });
//     });

//     describe("getReputation", function () {
//         it("should return the correct reputation score for a user", async function () {
//             await reputation.connect(approvedContract).updateReputation(1, user1.address, 10);
//             const reputationScore = await reputation.getReputation(user1.address);
//             expect(reputationScore).to.equal(10);
//         });

//         it("should return zero for a user with no reputation changes", async function () {
//             const reputationScore = await reputation.getReputation(user2.address);
//             expect(reputationScore).to.equal(0);
//         });
//     });

//     describe("Access Control", function () {
//         it("should allow only approved contracts to update reputation", async function () {
//             await expect(reputation.connect(user1).updateReputation(1, user1.address, 10))
//                 .to.be.revertedWith("Not an approved contract");
            
//             await expect(reputation.connect(approvedContract).updateReputation(1, user1.address, 10))
//                 .to.not.be.reverted;
//         });
//     });
// });
