// const { expect } = require("chai");
// const { ethers } = require("hardhat");

// describe("AccessRestriction", function () {
//     let AccessRestriction, accessRestriction;
//     let owner, admin, arbiter, script, dao, verifiedUser, approvedContract, user1;

//     beforeEach(async function () {
//         // Deploy the AccessRestriction contract
//         AccessRestriction = await ethers.getContractFactory("AccessRestriction");
//         [owner, admin, arbiter, script, dao, verifiedUser, approvedContract, user1] = await ethers.getSigners();
//         accessRestriction = await AccessRestriction.deploy(owner.address);
//         await accessRestriction.deployed();

//         // Set up roles in the contract
//         await accessRestriction.grantRole(await accessRestriction.ADMIN_ROLE(), admin.address);
//         await accessRestriction.grantRole(await accessRestriction.ARBITER_ROLE(), arbiter.address);
//         await accessRestriction.grantRole(await accessRestriction.SCRIPT_ROLE(), script.address);
//         await accessRestriction.grantRole(await accessRestriction.DAO_ROLE(), dao.address);
//         await accessRestriction.grantRole(await accessRestriction.VERFIED_USER_ROLE(), verifiedUser.address);
//         await accessRestriction.grantRole(await accessRestriction.APPROVED_CONTRACT_ROLE(), approvedContract.address);
//     });

//     describe("Initialization", function () {
//         it("should initialize with the correct owner", async function () {
//             const isOwner = await accessRestriction.isOwner(owner.address);
//             expect(isOwner).to.be.true;
//         });

//         it("should revert if trying to initialize with a non-owner deployer", async function () {
//             // The contract is designed to grant the deployer the owner role during construction.
//             // No re-initialization scenario since initialization is in the constructor.
//         });
//     });

//     describe("Role-Based Access Control", function () {
//         it("should correctly assign roles", async function () {
//             expect(await accessRestriction.isAdmin(admin.address)).to.be.true;
//             expect(await accessRestriction.isArbiter(arbiter.address)).to.be.true;
//             expect(await accessRestriction.isScript(script.address)).to.be.true;
//             expect(await accessRestriction.isDAO(dao.address)).to.be.true;
//             expect(await accessRestriction.isVerifiedUser(verifiedUser.address)).to.be.true;
//             expect(await accessRestriction.isApprovedContract(approvedContract.address)).to.be.true;
//         });

//         it("should allow the owner to grant and revoke roles", async function () {
//             await accessRestriction.grantRole(await accessRestriction.ADMIN_ROLE(), user1.address);
//             expect(await accessRestriction.isAdmin(user1.address)).to.be.true;

//             await accessRestriction.revokeRole(await accessRestriction.ADMIN_ROLE(), user1.address);
//             expect(await accessRestriction.isAdmin(user1.address)).to.be.false;
//         });

//         it("should revert if a non-owner tries to grant or revoke roles", async function () {
//             await expect(
//                 accessRestriction.connect(user1).grantRole(await accessRestriction.ADMIN_ROLE(), user1.address)
//             ).to.be.revertedWith(`AccessControl: account ${user1.address.toLowerCase()} is missing role ${await accessRestriction.DEFAULT_ADMIN_ROLE()}`);
//         });
//     });

//     describe("Pause and Unpause", function () {
//         it("should allow the owner to pause the contract", async function () {
//             await accessRestriction.pause();
//             expect(await accessRestriction.paused()).to.be.true;
//         });

//         it("should allow the owner to unpause the contract", async function () {
//             await accessRestriction.pause();
//             await accessRestriction.unpause();
//             expect(await accessRestriction.paused()).to.be.false;
//         });

//         it("should revert if a non-owner tries to pause or unpause the contract", async function () {
//             await expect(accessRestriction.connect(user1).pause()).to.be.revertedWith(`NotOwner("${user1.address}")`);
//             await accessRestriction.pause();
//             await expect(accessRestriction.connect(user1).unpause()).to.be.revertedWith(`NotOwner("${user1.address}")`);
//         });
//     });

//     describe("Role Verification Functions", function () {
//         it("should verify if an address is an owner", async function () {
//             expect(await accessRestriction.isOwner(owner.address)).to.be.true;
//             expect(await accessRestriction.isOwner(user1.address)).to.be.false;
//         });

//         it("should verify if an address is an admin", async function () {
//             expect(await accessRestriction.isAdmin(admin.address)).to.be.true;
//             expect(await accessRestriction.isAdmin(user1.address)).to.be.false;
//         });

//         it("should verify if an address is an approved contract", async function () {
//             expect(await accessRestriction.isApprovedContract(approvedContract.address)).to.be.true;
//             expect(await accessRestriction.isApprovedContract(user1.address)).to.be.false;
//         });

//         it("should verify if an address has script role", async function () {
//             expect(await accessRestriction.isScript(script.address)).to.be.true;
//             expect(await accessRestriction.isScript(user1.address)).to.be.false;
//         });

//         it("should verify if an address has arbiter role", async function () {
//             expect(await accessRestriction.isArbiter(arbiter.address)).to.be.true;
//             expect(await accessRestriction.isArbiter(user1.address)).to.be.false;
//         });

//         it("should verify if an address has DAO role", async function () {
//             expect(await accessRestriction.isDAO(dao.address)).to.be.true;
//             expect(await accessRestriction.isDAO(user1.address)).to.be.false;
//         });

//         it("should verify if an address has verified user role", async function () {
//             expect(await accessRestriction.isVerifiedUser(verifiedUser.address)).to.be.true;
//             expect(await accessRestriction.isVerifiedUser(user1.address)).to.be.false;
//         });
//     });

//     describe("Modifiers and Checks", function () {
//         it("should allow access to onlyOwner functions", async function () {
//             await accessRestriction.ifOwner(owner.address);
//             await expect(accessRestriction.ifOwner(user1.address)).to.be.revertedWith(`NotOwner("${user1.address}")`);
//         });

//         it("should allow access to onlyAdmin functions", async function () {
//             await accessRestriction.ifAdmin(admin.address);
//             await expect(accessRestriction.ifAdmin(user1.address)).to.be.revertedWith(`NotAdmin("${user1.address}")`);
//         });

//         it("should allow access to admin or owner functions", async function () {
//             await accessRestriction.ifOwnerOrAdmin(owner.address);
//             await accessRestriction.ifOwnerOrAdmin(admin.address);
//             await expect(accessRestriction.ifOwnerOrAdmin(user1.address)).to.be.revertedWith(`NotAdminOrOwner("${user1.address}")`);
//         });

//         it("should allow access to admin or approved contract functions", async function () {
//             await accessRestriction.ifAdminOrApprovedContract(admin.address);
//             await accessRestriction.ifAdminOrApprovedContract(approvedContract.address);
//             await expect(accessRestriction.ifAdminOrApprovedContract(user1.address)).to.be.revertedWith(`NotAdminOrApprovedContract("${user1.address}")`);
//         });

//         it("should allow access to admin or script functions", async function () {
//             await accessRestriction.ifAdminOrScript(admin.address);
//             await accessRestriction.ifAdminOrScript(script.address);
//             await expect(accessRestriction.ifAdminOrScript(user1.address)).to.be.revertedWith(`NotAdminOrScript("${user1.address}")`);
//         });

//         it("should allow access to approved contract functions", async function () {
//             await accessRestriction.ifApprovedContract(approvedContract.address);
//             await expect(accessRestriction.ifApprovedContract(user1.address)).to.be.revertedWith(`NotApprovedContract("${user1.address}")`);
//         });

//         it("should allow access to script functions", async function () {
//             await accessRestriction.ifScript(script.address);
//             await expect(accessRestriction.ifScript(user1.address)).to.be.revertedWith(`NotScript("${user1.address}")`);
//         });

//         it("should allow access to arbiter functions", async function () {
//             await accessRestriction.ifArbiter(arbiter.address);
//             await expect(accessRestriction.ifArbiter(user1.address)).to.be.revertedWith(`NotArbiter("${user1.address}")`);
//         });

//         it("should allow access to DAO functions", async function () {
//             await accessRestriction.ifDAO(dao.address);
//             await expect(accessRestriction.ifDAO(user1.address)).to.be.revertedWith(`NotDAO("${user1.address}")`);
//         });

//         it("should allow access to verified user functions", async function () {
//             await accessRestriction.ifVerifiedUser(verifiedUser.address);
//             await expect(accessRestriction.ifVerifiedUser(user1.address)).to.be.revertedWith(`NotVerifiedUser("${user1.address}")`);
//         });

//         it("should revert if the contract is paused", async function () {
//             await accessRestriction.pause();
//             await expect(accessRestriction.ifNotPaused()).to.be.revertedWith("ContractPaused()");
//         });

//         it("should revert if the contract is not paused", async function () {
//             await expect(accessRestriction.ifPaused()).to.be.revertedWith("ContractNotPaused()");
//         });
//     });
// });
