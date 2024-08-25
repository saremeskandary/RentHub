// import { expect } from "chai";
// import { ethers } from "hardhat";
// import {
//   AccessRestriction,
//   RentalDAO,
//   RentalAgreement,
//   Escrow,
//   Inspection,
//   DisputeResolution,
//   SocialFi,
//   Reputation,
//   MockToken,
// } from "../typechain-types";
// import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

// describe("Rental System Contracts", function () {
//   let accessRestriction: AccessRestriction;
//   let rentalDAO: RentalDAO;
//   let rentalAgreement: RentalAgreement;
//   let escrow: Escrow;
//   let inspection: Inspection;
//   let disputeResolution: DisputeResolution;
//   let socialFi: SocialFi;
//   let reputation: Reputation;
//   let mockToken: MockToken;

//   let owner: SignerWithAddress;
//   let admin: SignerWithAddress;
//   let renter: SignerWithAddress;
//   let rentee: SignerWithAddress;
//   let arbiter: SignerWithAddress;

//   beforeEach(async function () {
//     [owner, admin, renter, rentee, arbiter] = await ethers.getSigners();

//     // Deploy MockToken
//     const MockTokenFactory = await ethers.getContractFactory("MockToken");
//     mockToken = (await MockTokenFactory.deploy()) as MockToken;
//     await mockToken.waitForDeployment();

//     // Deploy AccessRestriction
//     const AccessRestrictionFactory = await ethers.getContractFactory("AccessRestriction");
//     accessRestriction = (await AccessRestrictionFactory.deploy(owner.address)) as AccessRestriction;
//     await accessRestriction.waitForDeployment();

//     // Deploy RentalDAO
//     const RentalDAOFactory = await ethers.getContractFactory("RentalDAO");
//     rentalDAO = (await RentalDAOFactory.deploy(accessRestriction.getAddress(), 100)) as RentalDAO; // 1% initial fee
//     await rentalDAO.waitForDeployment();

//     // Deploy Escrow
//     const EscrowFactory = await ethers.getContractFactory("Escrow");
//     escrow = (await EscrowFactory.deploy(
//       mockToken.getAddress(),
//       rentalDAO.getAddress(),
//       accessRestriction.getAddress(),
//     )) as Escrow;
//     await escrow.waitForDeployment();

//     // Deploy Inspection
//     const InspectionFactory = await ethers.getContractFactory("Inspection");
//     inspection = (await InspectionFactory.deploy()) as Inspection;
//     await inspection.waitForDeployment();

//     // Deploy DisputeResolution
//     const DisputeResolutionFactory = await ethers.getContractFactory("DisputeResolution");
//     disputeResolution = (await DisputeResolutionFactory.deploy()) as DisputeResolution;
//     await disputeResolution.waitForDeployment();

//     // Deploy SocialFi
//     const SocialFiFactory = await ethers.getContractFactory("SocialFi");
//     socialFi = (await SocialFiFactory.deploy(mockToken.getAddress())) as SocialFi;
//     await socialFi.waitForDeployment();

//     // Deploy Reputation
//     const ReputationFactory = await ethers.getContractFactory("Reputation");
//     reputation = (await ReputationFactory.deploy(accessRestriction.getAddress())) as Reputation;
//     await reputation.waitForDeployment();

//     // Deploy RentalAgreement
//     const RentalAgreementFactory = await ethers.getContractFactory("RentalAgreement");
//     rentalAgreement = (await RentalAgreementFactory.deploy(
//       mockToken.getAddress(),
//       escrow.getAddress(),
//       inspection.getAddress(),
//       disputeResolution.getAddress(),
//       socialFi.getAddress(),
//       accessRestriction.getAddress(),
//     )) as RentalAgreement;
//     await rentalAgreement.waitForDeployment();

//     // Setup roles
//     await accessRestriction.grantRole(await accessRestriction.ADMIN_ROLE(), admin.address);
//     await accessRestriction.grantRole(await accessRestriction.VERFIED_USER_ROLE(), renter.address);
//     await accessRestriction.grantRole(await accessRestriction.VERFIED_USER_ROLE(), rentee.address);
//     await accessRestriction.grantRole(await accessRestriction.ARBITER_ROLE(), arbiter.address);

//     // Initialize DisputeResolution
//     await disputeResolution.init(rentalAgreement.getAddress(), reputation.getAddress(), accessRestriction.getAddress());
//   });

//   describe("RentalAgreement", function () {
//     it("Should create a new agreement", async function () {
//       const tokenId = 1;
//       const rentalPeriod = 86400; // 1 day
//       const cost = ethers.parseEther("1");
//       const deposit = ethers.parseEther("0.5");

//       await expect(
//         rentalAgreement.connect(rentee).createAgreement(renter.address, tokenId, rentalPeriod, cost, deposit),
//       )
//         .to.emit(rentalAgreement, "AgreementCreated")
//         .withArgs(0, rentee.address, renter.address);
//     });
//   });

//   describe("Escrow", function () {
//     it("Should lock funds", async function () {
//       const agreementId = 0;
//       const deposit = ethers.parseEther("0.5");
//       const cost = ethers.parseEther("1");

//       // Approve tokens first
//       await mockToken.connect(renter).approve(escrow.getAddress(), deposit + cost); // Using '+' instead of 'add' for bigint

//       await expect(escrow.connect(renter).lockFunds(agreementId, deposit, cost))
//         .to.emit(escrow, "FundsLocked")
//         .withArgs(agreementId);
//     });
//   });

//   describe("DisputeResolution", function () {
//     it("Should initiate a dispute", async function () {
//       const agreementId = 0;

//       await expect(disputeResolution.connect(renter).initiateDispute(agreementId))
//         .to.emit(disputeResolution, "DisputeInitiated")
//         .withArgs(agreementId);
//     });

//     it("Should allow arbiter to vote", async function () {
//       const agreementId = 0;
//       await disputeResolution.connect(renter).initiateDispute(agreementId);

//       await expect(disputeResolution.connect(arbiter).voteOnDispute(agreementId, true))
//         .to.emit(disputeResolution, "ArbitersVoted")
//         .withArgs(agreementId, arbiter.address, true);
//     });
//   });

//   describe("SocialFi", function () {
//     it("Should reward a user", async function () {
//       const rewardAmount = 100;

//       await expect(socialFi.rewardUser(renter.address, rewardAmount))
//         .to.emit(socialFi, "UserRewarded")
//         .withArgs(renter.address, rewardAmount);

//       expect(await socialFi.getRewardBalance(renter.address)).to.equal(rewardAmount);
//     });
//   });

//   describe("Reputation", function () {
//     it("Should update reputation", async function () {
//       const agreementId = 0;
//       const reputationChange = 10;

//       await expect(reputation.connect(admin).updateReputation(agreementId, renter.address, reputationChange))
//         .to.emit(reputation, "ReputationUpdated")
//         .withArgs(agreementId, renter.address, reputationChange, reputationChange);

//       expect(await reputation.getReputation(renter.address)).to.equal(reputationChange);
//     });
//   });
// });
