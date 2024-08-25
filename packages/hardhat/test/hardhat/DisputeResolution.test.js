// const { expect } = require("chai");
// const { ethers } = require("hardhat");

// describe("DisputeResolution", function () {
//     let DisputeResolution, disputeResolution, MockRentalAgreement, rentalAgreement, MockReputation, reputation, MockAccessRestriction, accessRestriction;
//     let owner, admin, arbiter, rentee, renter, user1;

//     beforeEach(async function () {
//         // Deploy the mock contracts
//         MockRentalAgreement = await ethers.getContractFactory("MockRentalAgreement");
//         rentalAgreement = await MockRentalAgreement.deploy();
//         await rentalAgreement.deployed();

//         MockReputation = await ethers.getContractFactory("MockReputation");
//         reputation = await MockReputation.deploy();
//         await reputation.deployed();

//         MockAccessRestriction = await ethers.getContractFactory("MockAccessRestriction");
//         accessRestriction = await MockAccessRestriction.deploy();
//         await accessRestriction.deployed();

//         // Deploy the DisputeResolution contract
//         DisputeResolution = await ethers.getContractFactory("DisputeResolution");
//         [owner, admin, arbiter, rentee, renter, user1] = await ethers.getSigners();
//         disputeResolution = await DisputeResolution.deploy();
//         await disputeResolution.deployed();

//         // Initialize the contract with necessary dependencies
//         await disputeResolution.init(rentalAgreement.address, reputation.address, accessRestriction.address);

//         // Set up roles in the access restriction mock
//         await accessRestriction.setAdmin(admin.address, true);
//         await accessRestriction.grantRole(ethers.utils.id("ARBITER_ROLE"), arbiter.address);
//     });

//     describe("Initialization", function () {
//         it("should initialize with the correct addresses", async function () {
//             const rentalAgreementAddress = await disputeResolution.rentalAgreement();
//             const reputationAddress = await disputeResolution.reputation();
//             const accessRestrictionAddress = await disputeResolution.accessRestriction();

//             expect(rentalAgreementAddress).to.equal(rentalAgreement.address);
//             expect(reputationAddress).to.equal(reputation.address);
//             expect(accessRestrictionAddress).to.equal(accessRestriction.address);
//         });

//         it("should revert if initialized with a zero address", async function () {
//             await expect(disputeResolution.init(ethers.constants.AddressZero, reputation.address, accessRestriction.address))
//                 .to.be.revertedWith("InvalidAddress(\"rental agreement\")");
//         });
//     });

//     describe("initiateDispute", function () {
//         it("should allow initiation of a dispute", async function () {
//             await disputeResolution.initiateDispute(1);
//             const dispute = await disputeResolution.getDispute(1);

//             expect(dispute[0]).to.be.true; // isActive should be true
//         });

//         it("should emit DisputeInitiated event when a dispute is initiated", async function () {
//             await expect(disputeResolution.initiateDispute(1))
//                 .to.emit(disputeResolution, "DisputeInitiated")
//                 .withArgs(1);
//         });

//         it("should revert if a dispute is already active for the agreement", async function () {
//             await disputeResolution.initiateDispute(1);

//             await expect(disputeResolution.initiateDispute(1))
//                 .to.be.revertedWith("DisputeAlreadyExists(1)");
//         });
//     });

//     describe("voteOnDispute", function () {
//         beforeEach(async function () {
//             await disputeResolution.initiateDispute(1);
//         });

//         it("should allow an arbiter to vote on a dispute", async function () {
//             await disputeResolution.connect(arbiter).voteOnDispute(1, true);
//             const dispute = await disputeResolution.getDispute(1);

//             expect(dispute[1]).to.equal(1); // votesForRentee should be 1
//             expect(dispute[2]).to.equal(0); // votesForRenter should be 0
//         });

//         it("should emit ArbitersVoted event when an arbiter votes", async function () {
//             await expect(disputeResolution.connect(arbiter).voteOnDispute(1, true))
//                 .to.emit(disputeResolution, "ArbitersVoted")
//                 .withArgs(1, arbiter.address, true);
//         });

//         it("should revert if an arbiter has already voted", async function () {
//             await disputeResolution.connect(arbiter).voteOnDispute(1, true);

//             await expect(disputeResolution.connect(arbiter).voteOnDispute(1, false))
//                 .to.be.revertedWith(`ArbiterAlreadyVoted("${arbiter.address}", 1)`);
//         });

//         it("should revert if there is no active dispute", async function () {
//             await expect(disputeResolution.connect(arbiter).voteOnDispute(2, true))
//                 .to.be.revertedWith("NoActiveDispute(2)");
//         });

//         it("should revert if a non-arbiter tries to vote", async function () {
//             await expect(disputeResolution.connect(user1).voteOnDispute(1, true))
//                 .to.be.revertedWith(`NotArbiter("${user1.address}")`);
//         });
//     });

//     describe("resolveDispute", function () {
//         beforeEach(async function () {
//             await disputeResolution.initiateDispute(1);
//             await rentalAgreement.setAgreementParties(1, rentee.address, renter.address);
//         });

//         it("should resolve a dispute in favor of the rentee", async function () {
//             await disputeResolution.connect(arbiter).voteOnDispute(1, true); // vote for rentee

//             await disputeResolution.connect(arbiter).resolveDispute(1);

//             const dispute = await disputeResolution.getDispute(1);
//             expect(dispute[0]).to.be.false; // isActive should be false

//             const renteeReputation = await reputation.getReputation(rentee.address);
//             const renterReputation = await reputation.getReputation(renter.address);

//             expect(renteeReputation).to.equal(REPUTATION_PENALTY); // Winner gets reputation
//             expect(renterReputation).to.equal(-REPUTATION_PENALTY); // Loser loses reputation
//         });

//         it("should emit DisputeResolved event when a dispute is resolved", async function () {
//             await disputeResolution.connect(arbiter).voteOnDispute(1, true); // vote for rentee

//             await expect(disputeResolution.connect(arbiter).resolveDispute(1))
//                 .to.emit(disputeResolution, "DisputeResolved")
//                 .withArgs(1, rentee.address, renter.address);
//         });

//         it("should revoke user validation if reputation falls below threshold", async function () {
//             await reputation.setReputation(renter.address, -VALIDATION_REVOCATION_THRESHOLD * REPUTATION_PENALTY);
//             await disputeResolution.connect(arbiter).voteOnDispute(1, true); // vote for rentee

//             await disputeResolution.connect(arbiter).resolveDispute(1);

//             const isVerified = await accessRestriction.hasRole(ethers.utils.id("VERFIED_USER_ROLE"), renter.address);
//             expect(isVerified).to.be.false; // Validation should be revoked
//         });

//         it("should revert if there is no active dispute", async function () {
//             await expect(disputeResolution.connect(arbiter).resolveDispute(2))
//                 .to.be.revertedWith("NoActiveDispute(2)");
//         });

//         it("should revert if a non-arbiter tries to resolve a dispute", async function () {
//             await expect(disputeResolution.connect(user1).resolveDispute(1))
//                 .to.be.revertedWith(`NotArbiter("${user1.address}")`);
//         });
//     });

//     describe("addArbiter", function () {
//         it("should allow an admin to add an arbiter", async function () {
//             await disputeResolution.connect(admin).addArbiter(user1.address);

//             const isArbiter = await accessRestriction.hasRole(ethers.utils.id("ARBITER_ROLE"), user1.address);
//             expect(isArbiter).to.be.true;
//         });

//         it("should revert if a non-admin tries to add an arbiter", async function () {
//             await expect(disputeResolution.connect(user1).addArbiter(user1.address))
//                 .to.be.revertedWith(`NotAdmin("${user1.address}")`);
//         });

//         it("should revert if trying to add an arbiter with the zero address", async function () {
//             await expect(disputeResolution.connect(admin).addArbiter(ethers.constants.AddressZero))
//                 .to.be.revertedWith("InvalidAddress(\"arbiter\")");
//         });
//     });

//     describe("removeArbiter", function () {
//         beforeEach(async function () {
//             await disputeResolution.connect(admin).addArbiter(user1.address);
//         });

//         it("should allow an admin to remove an arbiter", async function () {
//             await disputeResolution.connect(admin).removeArbiter(user1.address);

//             const isArbiter = await accessRestriction.hasRole(ethers.utils.id("ARBITER_ROLE"), user1.address);
//             expect(isArbiter).to.be.false;
//         });

//         it("should revert if a non-admin tries to remove an arbiter", async function () {
//             await expect(disputeResolution.connect(user1).removeArbiter(user1.address))
//                 .to.be.revertedWith(`NotAdmin("${user1.address}")`);
//         });
//     });

//     describe("getDispute", function () {
//         beforeEach(async function () {
//             await disputeResolution.initiateDispute(1);
//         });

//         it("should return correct dispute details", async function () {
//             await disputeResolution.connect(arbiter).voteOnDispute(1, true); // vote for rentee
//             const dispute = await disputeResolution.getDispute(1);

//             expect(dispute[0]).to.be.true; // isActive should be true
//             expect(dispute[1]).to.equal(1); // votesForRentee should be 1
//             expect(dispute[2]).to.equal(0); // votesForRenter should be 0
//         });

//         it("should return default values for non-existent disputes", async function () {
//             const dispute = await disputeResolution.getDispute(2);

//             expect(dispute[0]).to.be.false; // isActive should be false
//             expect(dispute[1]).to.equal(0); // votesForRentee should be 0
//             expect(dispute[2]).to.equal(0); // votesForRenter should be 0
//         });
//     });
// });
